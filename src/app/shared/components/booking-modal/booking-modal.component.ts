import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { BookingService } from '../../../core/services/booking.service';
import { BookingsStore } from '../../../core/services/bookings.store';
import { ToastService } from '../../../core/services/toast.service';
import { PersianDatePipe } from '../../pipes/persian-date.pipe';
import { TimeSlot } from '../time-slot-grid/time-slot-grid.component';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, PersianDatePipe],
  template: `
    <div class="backdrop" (click)="onBackdropClick($event)" role="dialog" aria-modal="true">
      <div class="modal card-glass" (click)="$event.stopPropagation()">
        <header class="head">
          <div>
            <span class="eyebrow">تأیید رزرو</span>
            <h2>اطلاعات خود را وارد کنید</h2>
          </div>
          <button class="icon-btn" (click)="cancel()" aria-label="بستن">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </header>

        @if (slot) {
          <div class="summary">
            <div class="row">
              <span class="k">منبع</span>
              <span class="v">{{ resourceId }}</span>
            </div>
            <div class="row">
              <span class="k">تاریخ</span>
              <span class="v">{{ slot.start | persianDate }}</span>
            </div>
            <div class="row">
              <span class="k">ساعت</span>
              <span class="v num-en">{{ slot.start | date: 'HH:mm' }} — {{ slot.end | date: 'HH:mm' }}</span>
            </div>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="name">نام و نام خانوادگی</label>
            <input id="name" class="input" type="text" formControlName="customerName" placeholder="مثلاً: علی رضایی" autocomplete="name" />
            @if (shouldShow('customerName')) {
              <span class="error-msg">نام الزامی است</span>
            }
          </div>

          <div class="field">
            <label for="email">ایمیل</label>
            <input id="email" class="input num-en" type="email" formControlName="customerEmail" placeholder="you@example.com" autocomplete="email" dir="ltr" />
            @if (shouldShow('customerEmail')) {
              <span class="error-msg">ایمیل معتبر وارد کنید</span>
            }
          </div>

          <footer class="actions">
            <button type="button" class="btn btn-secondary" (click)="cancel()" [disabled]="submitting()">انصراف</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting()">
              @if (submitting()) {
                <span class="spinner"></span>
                در حال ثبت...
              } @else {
                تأیید و ثبت رزرو
              }
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 90;
      padding: 16px;
      animation: fadeIn 200ms var(--ease-out);
    }
    .modal {
      width: 100%;
      max-width: 480px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      padding: 24px;
      animation: scaleIn 240ms var(--ease-out);
    }
    .head {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }
    .eyebrow {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--brand-600);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .head h2 { margin-top: 4px; font-size: 1.25rem; }
    .icon-btn {
      width: 32px; height: 32px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      transition: all 150ms;
    }
    .icon-btn:hover { background: var(--neutral-100); color: var(--text); }

    .summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px 16px;
      background: linear-gradient(135deg, var(--brand-50), #faf5ff);
      border: 1px solid var(--brand-100);
      border-radius: var(--radius-md);
      margin-bottom: 16px;
    }
    .summary .row {
      display: flex; justify-content: space-between; align-items: center; font-size: 0.92rem;
    }
    .summary .k { color: var(--text-muted); font-weight: 600; }
    .summary .v { color: var(--text); font-weight: 600; }

    form { display: flex; flex-direction: column; gap: 14px; }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingModalComponent implements OnInit {
  @Input({ required: true }) slot!: TimeSlot;
  @Input({ required: true }) resourceId!: string;
  @Output() closed = new EventEmitter<{ success: boolean; bookingId?: string }>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(BookingService);
  private readonly store = inject(BookingsStore);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerEmail: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    // No-op: form already initialized
  }

  shouldShow(name: 'customerName' | 'customerEmail'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.dirty || c.touched);
  }

  onBackdropClick(_e: MouseEvent): void {
    this.cancel();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.cancel(); }

  cancel(): void {
    if (this.submitting()) return;
    this.closed.emit({ success: false });
  }

  async submit(): Promise<void> {
    if (this.form.invalid || !this.slot || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const v = this.form.getRawValue();
    try {
      const created = await firstValueFrom(
        this.api.create({
          resourceId: this.resourceId,
          customerName: v.customerName,
          customerEmail: v.customerEmail,
          startTime: this.slot.start.toISOString(),
          endTime: this.slot.end.toISOString(),
        }),
      );
      this.store.track(created);
      this.toast.success('رزرو شما ثبت شد ✅ منتظر تأیید نهایی باشید');
      this.closed.emit({ success: true, bookingId: created.id });
    } catch {
      // Error toast handled by interceptor
    } finally {
      this.submitting.set(false);
    }
  }
}
