import type { BookingResponseDto } from '../../dtos/booking/booking-response.dto'
import type { CreateBookingDto } from '../../dtos/booking/create-booking.dto'
import type { PaginatedResult } from '../ipagination'

export interface DateRange {
  start: string
  end: string
}

export interface AvailableDatesResult {
  availabilityRanges: DateRange[]
  bookedRanges: DateRange[]
}

export interface IBookingService {
  createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto>

  getAvailableDates(serviceId: string): Promise<AvailableDatesResult>

  getMyBookings(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<BookingResponseDto>>

  getProviderBookings(
    providerId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<BookingResponseDto>>

  getAllBookings(
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<BookingResponseDto>>

  cancelBooking(
    bookingId: string,
    userId: string,
  ): Promise<BookingResponseDto>
}
