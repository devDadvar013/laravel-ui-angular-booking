import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BOOKING_STATUS_META, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  template: `
    <span class="pill" [attr.data-tone]="meta.tone">
      <span class="dot" aria-hidden="true"></span>
      {{ meta.label }}
    </span>
  `,
  styles: [`
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      border: 1px solid transparent;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 3px color-mix(in oklab, currentColor 20%, transparent);
    }
    [data-tone="success"] {
      color: var(--success-700);
      background: var(--success-50);
      border-color: var(--success-100);
    }
    [data-tone="warning"] {
      color: var(--warning-700);
      background: var(--warning-50);
      border-color: var(--warning-100);
    }
    [data-tone="danger"] {
      color: var(--danger-700);
      background: var(--danger-50);
      border-color: var(--danger-100);
    }
    [data-tone="neutral"] {
      color: var(--neutral-600);
      background: var(--neutral-100);
      border-color: var(--neutral-200);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPillComponent {
  @Input({ required: true }) status!: BookingStatus;

  get meta() {
    return BOOKING_STATUS_META[this.status] ?? BOOKING_STATUS_META.pending;
  }
}
