import { IBooking, BookingDocument } from '../models/booking.model'

export abstract class BookingRepository {
  abstract create(data: Partial<IBooking>): Promise<BookingDocument>
  abstract findByUser(userId: string, page: number, limit: number): Promise<{ items: BookingDocument[]; total: number }>
  abstract findByProvider(providerId: string, page: number, limit: number): Promise<{ items: BookingDocument[]; total: number }>
  abstract findAll(page: number, limit: number): Promise<{ items: BookingDocument[]; total: number }>
  abstract findActiveByServiceId(serviceId: string): Promise<BookingDocument[]>
  abstract findById(id: string): Promise<BookingDocument | null>
  abstract cancel(id: string): Promise<BookingDocument | null>
}
