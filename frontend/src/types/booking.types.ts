import type { ProviderService } from './service.types';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  _id: string;
  userId: string;
  serviceId: string | ProviderService;
  providerId: string | { _id: string; name: string; email: string };
  startDate: string;
  endDate: string;
  numberOfDays: number;
  pricePerDay: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedDateRange {
  start: string;
  end: string;
}

export interface AvailableDatesResponse {
  availabilityRanges: BlockedDateRange[];
  bookedRanges: BlockedDateRange[];
}

export interface CreateBookingPayload {
  serviceId: string;
  startDate: string;
  endDate: string;
}
