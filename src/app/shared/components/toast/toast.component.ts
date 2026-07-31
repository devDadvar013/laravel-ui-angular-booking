import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [attr.data-tone]="t.tone">
          <span class="ico" aria-hidden="true">
            @switch (t.tone) {
              @case ('success') {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
              }
              @default {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              }
            }
          </span>
          <span class="msg">{{ t.message }}</span>
          <button class="close" (click)="toast.dismiss(t.id)" aria-label="بستن">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      bottom: 24px;
      inset-inline-end: 24px;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      min-width: 280px;
      max-width: 380px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      animation: scaleIn 240ms var(--ease-out);
    }
    .ico {
      flex: 0 0 28px;
      height: 28px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .msg { flex: 1; font-size: 0.92rem; font-weight: 500; color: var(--text); }
    .close {
      width: 28px; height: 28px;
      display: inline-flex; align-items: center; justify-content: center;
      color: var(--text-muted);
      border-radius: 8px;
      transition: all 150ms;
    }
    .close:hover { background: var(--neutral-100); color: var(--text); }

    [data-tone="success"] .ico { background: var(--success-50); color: var(--success-600); }
    [data-tone="error"]   .ico { background: var(--danger-50);  color: var(--danger-600); }
    [data-tone="warning"] .ico { background: var(--warning-50); color: var(--warning-600); }
    [data-tone="info"]    .ico { background: var(--brand-50);   color: var(--brand-600); }

    [data-tone="success"] { border-color: var(--success-100); }
    [data-tone="error"]   { border-color: var(--danger-100); }
    [data-tone="warning"] { border-color: var(--warning-100); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
