import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Booking, CreateBookingPayload } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** Create a new booking. Backend returns the saved booking. */
  create(payload: CreateBookingPayload): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, payload);
  }

  /** Get availability for a resource on a given date (YYYY-MM-DD or ISO). */
  getAvailability(resourceId: string, date: string | Date): Observable<Booking[]> {
    const dateStr =
      typeof date === 'string'
        ? date
        : date.toISOString().slice(0, 10);
    const params = new HttpParams().set('date', dateStr);
    return this.http.get<Booking[]>(
      `${this.base}/bookings/availability/${resourceId}`,
      { params },
    );
  }

  /** Get a single booking by id. */
  findOne(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.base}/bookings/${id}`);
  }

  /** Confirm a pending booking. */
  confirm(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/bookings/${id}/confirm`, {});
  }

  /** Cancel a booking. */
  cancel(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/bookings/${id}/cancel`, {});
  }
}
