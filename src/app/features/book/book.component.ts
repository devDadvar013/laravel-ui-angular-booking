import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import {
  TimeSlot,
  TimeSlotGridComponent,
} from '../../shared/components/time-slot-grid/time-slot-grid.component';
import {
  BookingModalComponent,
} from '../../shared/components/booking-modal/booking-modal.component';
import { Booking } from '../../core/models/booking.model';

interface Resource {
  id: string;
  label: string;
  icon: string;
  description: string;
  tone: 'brand' | 'success' | 'warning' | 'danger' | 'accent';
}

/** رابط ناقصی از متدهای عمومی خودِ Web Component که برای همگام‌سازی دستی لازم داریم. */
interface PersianDatepickerElement extends HTMLElement {
  setValue(year: number, month: number, day: number): void;
  close(): void;
}

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    FormsModule,
    TimeSlotGridComponent,
    BookingModalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container">
      <header class="page-head">
        <div>
          <span class="eyebrow">گام ۱ از ۲</span>
          <h1>رزرو جدید</h1>
          <p>منبع، تاریخ و ساعت دلخواه خود را انتخاب کنید.</p>
        </div>
      </header>

      <section class="card-block">
        <div class="section-title">انتخاب منبع</div>
        <div class="resources">
          @for (r of resources; track r.id) {
            <button
              type="button"
              class="resource"
              [class.selected]="resourceId() === r.id"
              [attr.data-tone]="r.tone"
              (click)="selectResource(r.id)"
            >
              <span class="ico" aria-hidden="true">{{ r.icon }}</span>
              <span class="info">
                <strong>{{ r.label }}</strong>
                <em>{{ r.description }}</em>
              </span>
              <span class="check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            </button>
          }
        </div>
      </section>

      <section class="card-block">
        <div class="section-title">انتخاب تاریخ</div>
        <div class="date-row">
          <button type="button" class="date-btn" (click)="shiftDay(-1)">
            روز قبل
          </button>
          <div class="date-display">
            <persian-datepicker-element
              #picker
              class="persian-datepicker"
              [value]="jalaliValue()"
              format="YYYY/MM/DD"
              rtl
              show-today-button
              (change)="onPersianDateChange($event)"
            ></persian-datepicker-element>
          </div>
          <button type="button" class="date-btn" (click)="shiftDay(1)">
            روز بعد
          </button>
        </div>
      </section>

      <section class="card-block">
        <div class="section-title">انتخاب ساعت</div>

        <div class="slots-shell">
          @if (loading()) {
            <div class="loading">
              <span class="spinner"></span>
              <span>در حال دریافت زمان‌های آزاد...</span>
            </div>
          } @else {
            <app-time-slot-grid
              [date]="selectedDate()"
              [bookings]="existing()"
              (slotPicked)="onSlotPicked($event)"
            />
          }
        </div>
      </section>
    </div>

    @if (pickedSlot(); as slot) {
      <app-booking-modal
        [slot]="slot"
        [resourceId]="resourceId()"
        (closed)="onModalClosed($event)"
      />
    }
  `,
  styles: [`
    .page-head {
      padding: 12px 0 28px;
    }
    .page-head h1 { margin-top: 6px; }
    .page-head p { color: var(--text-muted); margin-top: 6px; }
    .eyebrow {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--brand-600);
      background: var(--brand-50);
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }

    .card-block {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      margin-bottom: 18px;
    }

    .resources {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .resource {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      transition: all 200ms var(--ease-out);
      text-align: start;
      width: 100%;
    }
    .resource:hover {
      border-color: var(--brand-300);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
    .resource.selected {
      border-color: var(--brand-500);
      background: linear-gradient(135deg, var(--brand-50), #faf5ff);
      box-shadow: var(--shadow-glow);
    }
    .ico {
      width: 44px; height: 44px;
      border-radius: var(--radius-md);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 1.4rem;
      background: var(--neutral-100);
    }
    [data-tone="brand"] .ico   { background: var(--brand-50); }
    [data-tone="success"] .ico { background: var(--success-50); }
    [data-tone="warning"] .ico { background: var(--warning-50); }
    [data-tone="danger"] .ico  { background: var(--danger-50); }
    [data-tone="accent"] .ico  { background: #faf5ff; }

    .info { flex: 1; display: flex; flex-direction: column; line-height: 1.3; }
    .info strong { font-weight: 700; }
    .info em { font-style: normal; color: var(--text-muted); font-size: 0.8rem; }

    .check {
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 2px solid var(--border);
      display: inline-flex; align-items: center; justify-content: center;
      color: white;
      background: transparent;
      transition: all 200ms;
    }
    .resource.selected .check {
      background: var(--brand-500);
      border-color: var(--brand-500);
    }

    .date-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .date-btn {
      height: 38px;
      padding: 0 14px;
      display: inline-flex; align-items: center; justify-content: center;
      white-space: nowrap;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-muted);
      background: var(--surface);
      transition: all 150ms;
    }
    .date-btn:hover {
      background: var(--surface-2);
      color: var(--text);
      border-color: var(--brand-300);
    }
    .date-display {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 4px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface);
    }
    .persian-datepicker {
      width: 100%;
    }

    .slots-shell { min-height: 200px; }
    .loading {
      display: flex; align-items: center; gap: 10px;
      padding: 32px;
      color: var(--text-muted);
      justify-content: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly api = inject(BookingService);
  private readonly toast = inject(ToastService);

  /** Curated resources for the demo. Backend accepts any string. */
  readonly resources: Resource[] = [
    { id: 'room-1',  label: 'اتاق کنفرانس',  icon: '🪑', description: 'ظرفیت ۱۲ نفر · ویدئو پروژکتور', tone: 'brand' },
    { id: 'desk-3',  label: 'میز شماره ۳',   icon: '🖥️', description: 'محیط آرام · نزدیک پنجره',       tone: 'success' },
    { id: 'studio',  label: 'استودیو',         icon: '🎙️', description: 'ضبط صدا و تصویر',                tone: 'accent' },
    { id: 'hall-a',  label: 'سالن A',          icon: '🏛️', description: 'برگزاری رویداد',                tone: 'warning' },
  ];

  readonly resourceId = signal<string>(this.resources[0].id);

  /** Selected date normalized to local midnight. */
  readonly selectedDate = signal<Date>(this.today());

  /** Existing bookings for the selected resource+date (PENDING/CONFIRMED). */
  readonly existing = signal<Booking[]>([]);
  readonly loading = signal<boolean>(false);

  /** Slot the user picked — opens the modal. */
  readonly pickedSlot = signal<TimeSlot | null>(null);

  /** تاریخ انتخاب‌شده به‌صورت تاپل [سال, ماه, روز] شمسی، برای مقداردهی اولیه دیت‌پیکر. */
  readonly jalaliValue = computed<[number, number, number]>(() => {
    return this.toJalaliTuple(this.selectedDate());
  });

  /** ارجاع به المان خام Web Component برای فراخوانی دستی متدهای setValue/close. */
  @ViewChild('picker') private pickerRef?: ElementRef<PersianDatepickerElement>;

  constructor() {
    void this.refresh();

    // هر بار selectedDate تغییر کند (مثلاً با دکمه‌های روز بعد/قبل)، مقدار نمایش‌داده‌شده
    // در خودِ Web Component را هم به‌صورت دستی به‌روزرسانی می‌کنیم؛ چون این کامپوننت
    // فقط مقدار اولیه‌ی property/attribute را در نظر می‌گیرد و برای تغییرات بعدی
    // باید متد setValue را صدا زد.
    effect(() => {
      const [y, m, d] = this.jalaliValue();
      this.pickerRef?.nativeElement?.setValue?.(y, m, d);
    });
  }

  selectResource(id: string): void {
    this.resourceId.set(id);
    void this.refresh();
  }

  shiftDay(delta: number): void {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + delta);
    this.selectedDate.set(d);
    void this.refresh();
  }

  /**
   * رویداد change کامپوننت خام persian-datepicker-element (یک CustomEvent با detail).
   *
   * این کتابخانه یک باگ داخلی دارد: هر بار attributeChangedCallback برای یکی از
   * اتریبیوت‌های show-*-button اجرا شود (که در قالب ما یک‌بار موقع mount اولیه
   * برای show-today-button پیش می‌آید)، شادو-DOM را کامل دوباره می‌سازد و دوباره
   * addEventListeners() را صدا می‌زند — و چون این متد از handleDayClick.bind(this)
   * استفاده می‌کند (که هر بار یک تابع تازه می‌سازد)، به‌جای جایگزینی، یک listener
   * کلیک اضافه روی سلول‌های تقویم انباشته می‌شود. نتیجه: هر کلیک واقعی روی یک روز،
   * رویداد change را دو بار (با همان تاریخ) dispatch می‌کند. راه‌حل درستِ سمت
   * Angular این است که رویدادهای change تکراری برای همان تاریخِ از قبل انتخاب‌شده
   * را نادیده بگیریم؛ همینه که جلوی ارسال دوبارهٔ درخواست availability را می‌گیرد.
   */
  onPersianDateChange(event: Event): void {
    const detail = (
      event as CustomEvent<{
        jalali: [number, number, number];
        gregorian: [number, number, number];
        isoString: string;
      }>
    ).detail;
    if (!detail) return;
    const next = detail.isoString
      ? new Date(detail.isoString)
      : new Date(detail.gregorian[0], detail.gregorian[1] - 1, detail.gregorian[2]);
    next.setHours(0, 0, 0, 0);

    // دومین (و هر) dispatch تکراری برای همان تاریخ را نادیده می‌گیریم.
    if (next.getTime() === this.selectedDate().getTime()) {
      return;
    }

    this.selectedDate.set(next);
    void this.refresh();

    // تقویم را بعد از انتخاب تاریخ به‌صورت خودکار ببند.
    // این فراخوانی را با setTimeout به تیک بعدی موکول می‌کنیم، چون اگر بلافاصله و
    // هم‌زمان با پردازش داخلی خودِ رویداد click کامپوننت صدا زده شود، منطق داخلی
    // خودش دوباره تقویم را باز/باز نگه می‌دارد.
    setTimeout(() => this.pickerRef?.nativeElement?.close?.(), 0);
  }

  onSlotPicked(slot: TimeSlot): void {
    this.pickedSlot.set(slot);
  }

  onModalClosed(result: { success: boolean; bookingId?: string }): void {
    this.pickedSlot.set(null);
    if (result.success) {
      // Refresh availability since a new PENDING booking now occupies a slot.
      void this.refresh();
    }
  }

  private today(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /** تبدیل تاریخ میلادی به تاپل [سال, ماه, روز] شمسی، بدون نیاز به کتابخانه جانبی. */
  private static readonly jalaliFormatter = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  private toJalaliTuple(date: Date): [number, number, number] {
    const parts = BookComponent.jalaliFormatter.formatToParts(date);
    const year = Number(parts.find((p) => p.type === 'year')?.value ?? 0);
    const month = Number(parts.find((p) => p.type === 'month')?.value ?? 0);
    const day = Number(parts.find((p) => p.type === 'day')?.value ?? 0);
    return [year, month, day];
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await firstValueFrom(
        this.api.getAvailability(this.resourceId(), this.selectedDate()),
      );
      this.existing.set(list);
    } catch {
      // toast handled by interceptor
    } finally {
      this.loading.set(false);
    }
  }
}
