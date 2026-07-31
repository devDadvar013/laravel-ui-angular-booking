import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
  timeoutMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, tone: ToastTone = 'info', timeoutMs = 4000): void {
    const id = this.nextId++;
    const toast: Toast = { id, message, tone, timeoutMs };
    this.toasts.update((list) => [...list, toast]);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error'); }
  info(message: string)    { this.show(message, 'info'); }
  warning(message: string) { this.show(message, 'warning'); }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
