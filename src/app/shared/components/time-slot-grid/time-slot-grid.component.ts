import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Booking } from '../../../core/models/booking.model';

export interface TimeSlot {
  start: Date;
  end: Date;
  /** 'free' | 'booked' | 'past' */
  state: 'free' | 'booked' | 'past';
  booking?: Booking;
}

@Component({
  selector: 'app-time-slot-grid',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="slots">
      <div class="slot-row header">
        <span>ساعت</span>
        <span>وضعیت</span>
      </div>
      @for (slot of slots(); track slot.start.getTime()) {
        <button
          type="button"
          class="slot-row"
          [class.free]="slot.state === 'free'"
          [class.booked]="slot.state === 'booked'"
          [class.past]="slot.state === 'past'"
          [class.selected]="isSelected(slot)"
          [disabled]="slot.state !== 'free'"
          (click)="onSelect(slot)"
        >
          <span class="time">
            <span class="num-en">{{ slot.start | date: 'HH:mm' }}</span>
            <span class="dash">—</span>
            <span class="num-en">{{ slot.end | date: 'HH:mm' }}</span>
          </span>
          <span class="state">
            @switch (slot.state) {
              @case ('free') {
                <span class="state-pill free">آزاد</span>
              }
              @case ('booked') {
                <span class="state-pill booked" [title]="slot.booking?.customerName">
                  رزرو شده
                </span>
              }
              @case ('past') {
                <span class="state-pill past">گذشته</span>
              }
            }
            @if (slot.state === 'free') {
              <span class="cta" aria-hidden="true">رزرو ←</span>
            }
          </span>
        </button>
      }
    </div>
  `,
  styles: [`
    .slots {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .slot-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      background: var(--surface);
      border: 1px solid var(--border-soft);
      transition: all 200ms var(--ease-out);
      text-align: start;
      width: 100%;
      font-family: inherit;
      color: var(--text);
    }
    .slot-row.header {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 16px;
    }
    .slot-row:not(.header):not(:disabled):hover {
      border-color: var(--brand-300);
      background: var(--brand-50);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
    .slot-row.selected {
      border-color: var(--brand-500);
      background: var(--brand-50);
      box-shadow: var(--shadow-glow);
    }
    .slot-row:disabled { cursor: not-allowed; }

    .time {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .dash { color: var(--text-subtle); }
    .state {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .state-pill {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: var(--radius-full);
      font-size: 0.76rem;
      font-weight: 700;
    }
    .state-pill.free   { background: var(--success-50); color: var(--success-700); border: 1px solid var(--success-100); }
    .state-pill.booked { background: var(--danger-50);  color: var(--danger-700);  border: 1px solid var(--danger-100); }
    .state-pill.past   { background: var(--neutral-100); color: var(--neutral-500); border: 1px solid var(--neutral-200); }
    .cta {
      color: var(--brand-600);
      font-weight: 600;
      font-size: 0.85rem;
      opacity: 0;
      transition: opacity 200ms;
    }
    .slot-row.free:hover .cta { opacity: 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotGridComponent {
  /** Selected date (any time on that day). */
  @Input({ required: true }) set date(d: Date) {
    this._date = d;
    this.recompute();
  }
  get date() { return this._date; }
  private _date!: Date;

  /** Existing bookings for that date. */
  @Input() set bookings(list: Booking[]) {
    this._bookings = list ?? [];
    this.recompute();
  }
  get bookings() { return this._bookings; }
  private _bookings: Booking[] = [];

  /** Slot duration in minutes (default 60). */
  @Input() slotMinutes = 60;

  /** Opening hour (24h). */
  @Input() openHour = 8;
  /** Closing hour (24h). */
  @Input() closeHour = 22;

  @Output() slotPicked = new EventEmitter<TimeSlot>();

  readonly selected = signal<TimeSlot | null>(null);

  readonly slots = computed<TimeSlot[]>(() => this._slots);
  private _slots: TimeSlot[] = [];

  isSelected(s: TimeSlot): boolean {
    const sel = this.selected();
    return !!sel && sel.start.getTime() === s.start.getTime();
  }

  onSelect(s: TimeSlot): void {
    if (s.state !== 'free') return;
    this.selected.set(s);
    this.slotPicked.emit(s);
  }

  /** Re-derive the slot list whenever inputs change. */
  private recompute(): void {
    if (!this._date) return;
    const list: TimeSlot[] = [];
    const dayKey = localDateKey(this._date);
    const now = new Date();

    // Normalize "open at" and "close at" in local time on the selected date
    const dayStart = new Date(this._date);
    dayStart.setHours(this.openHour, 0, 0, 0);
    const dayEnd = new Date(this._date);
    dayEnd.setHours(this.closeHour, 0, 0, 0);

    const slotMs = this.slotMinutes * 60 * 1000;
    for (let t = dayStart.getTime(); t + slotMs <= dayEnd.getTime(); t += slotMs) {
      const start = new Date(t);
      const end = new Date(t + slotMs);

      // Find a booking that overlaps this slot for the same day
      const overlap: Booking | undefined = this._bookings.find((b) => {
        const bStart = new Date(b.startTime);
        const bEnd = new Date(b.endTime);
        // Ignore bookings whose times are invalid or on a different day
        if (
          Number.isNaN(bStart.getTime()) ||
          Number.isNaN(bEnd.getTime()) ||
          localDateKey(bStart) !== dayKey
        ) {
          return false;
        }
        // overlap test, in same calendar day
        return bStart < end && bEnd > start;
      });

      let state: TimeSlot['state'] = 'free';
      if (overlap) state = 'booked';
      else if (end.getTime() < now.getTime()) state = 'past';

      list.push({ start, end, state, booking: overlap });
    }
    this._slots = list;
    // Drop selection if no longer valid
    const sel = this.selected();
    if (sel) {
      const still = list.find((s) => s.start.getTime() === sel.start.getTime());
      if (!still || still.state !== 'free') this.selected.set(null);
    }
  }
}

/** Local (not UTC) calendar-day key, e.g. "2026-08-31". Avoids toISOString's UTC shift. */
function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
