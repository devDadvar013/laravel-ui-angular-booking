import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Booking, CreateBookingPayload } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** Create a new booking. Backend returns the saved booking. */
  create(payload: CreateBookingPayload): Observable<Booking> {
    return this.http.post<unknown>(`${this.base}/bookings`, payload).pipe(map(toBooking));
  }

  /** Get availability for a resource on a given date (YYYY-MM-DD or ISO). */
  getAvailability(resourceId: string, date: string | Date): Observable<Booking[]> {
    const dateStr =
      typeof date === 'string'
        ? date
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const params = new HttpParams().set('date', dateStr);
    return this.http.get<unknown[]>(
      `${this.base}/bookings/availability/${resourceId}`,
      { params },
    ).pipe(map((list) => list.map(toBooking)));
  }

  /** Get a single booking by id. */
  findOne(id: string): Observable<Booking> {
    return this.http.get<unknown>(`${this.base}/bookings/${id}`).pipe(map(toBooking));
  }

  /** Confirm a pending booking. */
  confirm(id: string): Observable<Booking> {
    return this.http.patch<unknown>(`${this.base}/bookings/${id}/confirm`, {}).pipe(map(toBooking));
  }

  /** Cancel a booking. */
  cancel(id: string): Observable<Booking> {
    return this.http.patch<unknown>(`${this.base}/bookings/${id}/cancel`, {}).pipe(map(toBooking));
  }
}

/**
 * The NestJS backend serializes bookings with snake_case keys
 * (customer_name, resource_id, ...). Map them to the camelCase
 * shape the UI model expects.
 */
function toBooking(raw: unknown): Booking {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r['id'] ?? ''),
    resourceId: String(r['resource_id'] ?? r['resourceId'] ?? ''),
    customerName: String(r['customer_name'] ?? r['customerName'] ?? ''),
    customerEmail: String(r['customer_email'] ?? r['customerEmail'] ?? ''),
    startTime: String(r['start_time'] ?? r['startTime'] ?? ''),
    endTime: String(r['end_time'] ?? r['endTime'] ?? ''),
    status: (r['status'] ?? 'pending') as Booking['status'],
    expiresAt:
      r['expires_at'] != null || r['expiresAt'] != null
        ? String(r['expires_at'] ?? r['expiresAt'])
        : null,
    createdAt: String(r['created_at'] ?? r['createdAt'] ?? ''),
    updatedAt: String(r['updated_at'] ?? r['updatedAt'] ?? ''),
  };
}
