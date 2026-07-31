import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Booking } from '../models/booking.model';
import { BookingService } from './booking.service';
import { ToastService } from './toast.service';

/**
 * Lightweight global store for bookings that the current session
 * has created or interacted with. Persists to localStorage so the
 * "My Bookings" page can render after a reload.
 */
@Injectable({ providedIn: 'root' })
export class BookingsStore {
  private readonly api = inject(BookingService);
  private readonly toast = inject(ToastService);

  private readonly storageKey = 'booking-ui:tracked-ids';

  private readonly _ids = signal<string[]>(this.loadFromStorage());
  private readonly _byId = signal<Map<string, Booking>>(new Map());
  private readonly _loading = signal<boolean>(false);

  readonly trackedIds = this._ids.asReadonly();
  readonly bookings = computed(() => Array.from(this._byId().values()));
  readonly loading = this._loading.asReadonly();
  readonly count = computed(() => this._ids().length);

  track(booking: Booking): void {
    this._byId.update((m) => {
      const next = new Map(m);
      next.set(booking.id, booking);
      return next;
    });
    if (!this._ids().includes(booking.id)) {
      this._ids.update((ids) => {
        const next = [...ids, booking.id];
        this.persist(next);
        return next;
      });
    } else {
      this.persist(this._ids());
    }
  }

  untrack(id: string): void {
    this._byId.update((m) => {
      const next = new Map(m);
      next.delete(id);
      return next;
    });
    this._ids.update((ids) => {
      const next = ids.filter((i) => i !== id);
      this.persist(next);
      return next;
    });
  }

  /** Refresh all tracked bookings from the API. */
  async refreshAll(): Promise<void> {
    const ids = this._ids();
    if (ids.length === 0) return;
    this._loading.set(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => firstValueFrom(this.api.findOne(id))),
      );
      const next = new Map(this._byId());
      const survivingIds: string[] = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          next.set(r.value.id, r.value);
          survivingIds.push(r.value.id);
        } else {
          // keep in the list, the booking may have been expired/cleaned
          survivingIds.push(ids[i]);
        }
      });
      this._byId.set(next);
      this._ids.set(survivingIds);
      this.persist(survivingIds);
    } finally {
      this._loading.set(false);
    }
  }

  async confirm(id: string): Promise<Booking | null> {
    try {
      const updated = await firstValueFrom(this.api.confirm(id));
      this._byId.update((m) => new Map(m).set(updated.id, updated));
      this.toast.success('رزرو با موفقیت تأیید شد ✨');
      return updated;
    } catch (e) {
      this.toast.error(this.toMessage(e, 'خطا در تأیید رزرو'));
      return null;
    }
  }

  async cancel(id: string): Promise<Booking | null> {
    try {
      const updated = await firstValueFrom(this.api.cancel(id));
      this._byId.update((m) => new Map(m).set(updated.id, updated));
      this.toast.success('رزرو لغو شد');
      return updated;
    } catch (e) {
      this.toast.error(this.toMessage(e, 'خطا در لغو رزرو'));
      return null;
    }
  }

  clear(): void {
    this._byId.set(new Map());
    this._ids.set([]);
    this.persist([]);
  }

  private toMessage(e: unknown, fallback: string): string {
    if (e && typeof e === 'object' && 'error' in e) {
      const err = (e as { error?: { message?: string | string[] } }).error;
      if (err?.message) {
        return Array.isArray(err.message) ? err.message.join('، ') : err.message;
      }
    }
    return fallback;
  }

  private loadFromStorage(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private persist(ids: string[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    } catch {
      /* ignore quota errors */
    }
  }
}
