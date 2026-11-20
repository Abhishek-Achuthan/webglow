import { IBooking, BookingDocument } from '../models/booking.model'

export interface IBookingRepository {
  create(data: Partial<IBooking>): Promise<BookingDocument>
  findByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ items: BookingDocument[]; total: number }>
  findByProvider(
    providerId: string,
    page: number,
    limit: number,
  ): Promise<{ items: BookingDocument[]; total: number }>
  findAll(
    page: number,
    limit: number,
  ): Promise<{ items: BookingDocument[]; total: number }>
  findActiveByServiceId(serviceId: string): Promise<BookingDocument[]>
  findById(id: string): Promise<BookingDocument | null>
  cancel(id: string): Promise<BookingDocument | null>
}

export type BookingRepository = IBookingRepository
