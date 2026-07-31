import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BookingsStore } from '../../core/services/bookings.store';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';
import { PersianDatePipe } from '../../shared/pipes/persian-date.pipe';
import { BookingStatus } from '../../core/models/booking.model';

type FilterValue = 'all' | BookingStatus;

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [DatePipe, PersianDatePipe, RouterLink, StatusPillComponent],
  template: `
    <div class="container">
      <header class="page-head">
        <div>
          <span class="eyebrow">سابقه رزروها</span>
          <h1>رزروهای من</h1>
          <p>لیست رزروهایی که در این مرورگر ثبت کرده‌اید. می‌توانید آن‌ها را تأیید یا لغو کنید.</p>
        </div>
        <a routerLink="/book" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          رزرو جدید
        </a>
      </header>

      @if (store.loading()) {
        <div class="card-block loading">
          <span class="spinner"></span>
          <span>در حال به‌روزرسانی رزروها...</span>
        </div>
      } @else if (store.bookings().length === 0) {
        <div class="card-block empty-state">
          <div class="icon" aria-hidden="true">📅</div>
          <h3>هنوز رزروی ثبت نکرده‌اید</h3>
          <p>اولین رزرو خود را از صفحه رزرو جدید ثبت کنید.</p>
          <a routerLink="/book" class="btn btn-primary" style="margin-top: 14px">ثبت اولین رزرو</a>
        </div>
      } @else {
        <div class="filters">
          <button class="filter" [class.active]="filter() === 'all'" (click)="filter.set('all')">
            همه <span class="badge-c">{{ total() }}</span>
          </button>
          <button class="filter" [class.active]="filter() === 'pending'" (click)="filter.set('pending')">
            در انتظار <span class="badge-c warning">{{ counts().pending }}</span>
          </button>
          <button class="filter" [class.active]="filter() === 'confirmed'" (click)="filter.set('confirmed')">
            تأییدشده <span class="badge-c success">{{ counts().confirmed }}</span>
          </button>
          <button class="filter" [class.active]="filter() === 'cancelled'" (click)="filter.set('cancelled')">
            لغوشده <span class="badge-c danger">{{ counts().cancelled }}</span>
          </button>
          <button class="filter" [class.active]="filter() === 'expired'" (click)="filter.set('expired')">
            منقضی <span class="badge-c neutral">{{ counts().expired }}</span>
          </button>
        </div>

        <div class="list">
          @for (b of filtered(); track b.id) {
            <article class="card booking">
              <div class="left">
                <header class="top">
                  <span class="resource">{{ b.resourceId }}</span>
                  <app-status-pill [status]="b.status" />
                </header>
                <div class="when">
                  <span class="date">{{ b.startTime | persianDate: 'compact' }}</span>
                  <span class="time num-en">
                    {{ b.startTime | date: 'HH:mm' }} — {{ b.endTime | date: 'HH:mm' }}
                  </span>
                </div>
                <div class="meta">
                  <span><strong>نام:</strong> <bdi>{{ b.customerName }}</bdi></span>
                  <span><strong>ایمیل:</strong> <bdi class="num-en">{{ b.customerEmail }}</bdi></span>
                </div>
              </div>

              <div class="right">
                @if (b.status === 'pending') {
                  @if (b.expiresAt) {
                    <span class="expire">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                      مهلت تا {{ b.expiresAt | date: 'HH:mm' }}
                    </span>
                  }
                  <button class="btn btn-success btn-sm" (click)="confirm(b.id)">تأیید نهایی</button>
                }
                @if (b.status === 'pending' || b.status === 'confirmed') {
                  <button class="btn btn-danger btn-sm" (click)="cancel(b.id)">لغو رزرو</button>
                }
              </div>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0 24px;
      flex-wrap: wrap;
    }
    .eyebrow {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--brand-600);
      background: var(--brand-50);
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }
    .page-head p { color: var(--text-muted); margin-top: 6px; max-width: 520px; }

    .card-block {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 48px;
      box-shadow: var(--shadow-sm);
      text-align: center;
    }
    .card-block.loading {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      color: var(--text-muted);
    }

    .filters {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .filter {
      padding: 8px 14px;
      border-radius: var(--radius-full);
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.88rem;
      display: inline-flex; align-items: center; gap: 8px;
      transition: all 150ms;
    }
    .filter:hover { color: var(--text); }
    .filter.active {
      background: var(--brand-500);
      color: white;
      border-color: var(--brand-500);
    }
    .badge-c {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 22px; height: 18px; padding: 0 6px;
      border-radius: var(--radius-full);
      font-size: 0.72rem; font-weight: 700;
      background: var(--neutral-100);
      color: var(--text);
    }
    .filter.active .badge-c {
      background: rgba(255,255,255,0.25);
      color: white;
    }
    .badge-c.warning { background: var(--warning-100); color: var(--warning-700); }
    .badge-c.success { background: var(--success-100); color: var(--success-700); }
    .badge-c.danger  { background: var(--danger-100);  color: var(--danger-700); }
    .badge-c.neutral { background: var(--neutral-200); color: var(--neutral-700); }

    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .booking {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      padding: 18px;
      align-items: center;
    }
    .top {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 6px;
    }
    .resource {
      font-weight: 700;
      font-size: 0.92rem;
      color: var(--text);
    }
    .when {
      display: flex; gap: 12px; align-items: center;
      color: var(--text);
      font-weight: 600;
      margin-bottom: 6px;
    }
    .when .date { color: var(--text-muted); font-weight: 500; }
    .when .time {
      background: var(--brand-50);
      color: var(--brand-700);
      padding: 2px 10px;
      border-radius: var(--radius-full);
      font-size: 0.86rem;
      font-weight: 700;
    }
    .meta {
      display: flex; gap: 18px; flex-wrap: wrap;
      color: var(--text-muted);
      font-size: 0.88rem;
    }
    .meta strong { color: var(--text); font-weight: 600; }

    .right {
      display: flex; align-items: center; gap: 8px;
    }
    .expire {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--warning-700);
      background: var(--warning-50);
      border: 1px solid var(--warning-100);
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .booking { grid-template-columns: 1fr; }
      .right { justify-content: flex-end; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  readonly store = inject(BookingsStore);

  readonly filter: WritableSignal<FilterValue> = signal<FilterValue>('all');

  readonly counts = computed(() => {
    const all = this.store.bookings();
    return {
      pending:   all.filter((b) => b.status === 'pending').length,
      confirmed: all.filter((b) => b.status === 'confirmed').length,
      cancelled: all.filter((b) => b.status === 'cancelled').length,
      expired:   all.filter((b) => b.status === 'expired').length,
    };
  });

  readonly total = computed(() => this.store.count());

  readonly filtered = computed(() => {
    const f = this.filter();
    const all = this.store.bookings().slice().sort((a, b) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
    if (f === 'all') return all;
    return all.filter((b) => b.status === f);
  });

  ngOnInit(): void {
    void this.store.refreshAll();
  }

  confirm(id: string): void { void this.store.confirm(id); }
  cancel(id: string): void { void this.store.cancel(id); }
}
