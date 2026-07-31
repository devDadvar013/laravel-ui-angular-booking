export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired';

export interface Booking {
  id: string;
  resourceId: string;
  customerName: string;
  customerEmail: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  status: BookingStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  resourceId: string;
  customerName: string;
  customerEmail: string;
  startTime: string; // ISO
  endTime: string;   // ISO
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  pending:   { label: 'در انتظار تأیید',   tone: 'warning' },
  confirmed: { label: 'تأیید شده',         tone: 'success' },
  cancelled: { label: 'لغو شده',           tone: 'danger'  },
  expired:   { label: 'منقضی شده',         tone: 'neutral' },
};
