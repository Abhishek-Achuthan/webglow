import { BookingDocument, IBooking } from '../models/booking.model'
import {
  BookingResponseDto,
  PopulatedUserSummaryDto,
  PopulatedServiceSummaryDto,
} from '../dtos/booking/booking-response.dto'
import { PaginatedResult } from '../interfaces/IPagination'

export class BookingMapper {
  private static mapRef(field: any): any {
    if (!field) return ''
    if (typeof field === 'object' && field._id) {
      const res: any = { _id: field._id.toString() }
      if (field.name !== undefined) res.name = field.name
      if (field.email !== undefined) res.email = field.email
      if (field.title !== undefined) res.title = field.title
      if (field.category !== undefined) res.category = field.category
      if (field.pricePerDay !== undefined) res.pricePerDay = field.pricePerDay
      return res
    }
    return field.toString()
  }

  static toDto(doc: BookingDocument | IBooking | any): BookingResponseDto {
    const obj = typeof doc?.toJSON === 'function' ? doc.toJSON() : doc

    return {
      _id: obj._id?.toString() ?? '',
      userId: BookingMapper.mapRef(obj.userId),
      serviceId: BookingMapper.mapRef(obj.serviceId),
      providerId: BookingMapper.mapRef(obj.providerId),
      startDate:
        obj.startDate instanceof Date
          ? obj.startDate.toISOString()
          : new Date(obj.startDate).toISOString(),
      endDate:
        obj.endDate instanceof Date
          ? obj.endDate.toISOString()
          : new Date(obj.endDate).toISOString(),
      numberOfDays: obj.numberOfDays ?? 0,
      pricePerDay: obj.pricePerDay ?? 0,
      totalAmount: obj.totalAmount ?? 0,
      status: obj.status,
      createdAt:
        obj.createdAt instanceof Date
          ? obj.createdAt.toISOString()
          : obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : '',
      updatedAt:
        obj.updatedAt instanceof Date
          ? obj.updatedAt.toISOString()
          : obj.updatedAt
            ? new Date(obj.updatedAt).toISOString()
            : '',
    }
  }

  static toDtoList(docs: (BookingDocument | IBooking | any)[]): BookingResponseDto[] {
    return docs.map((doc) => BookingMapper.toDto(doc))
  }

  static toPaginatedDto(
    result:
      | {
          items: (BookingDocument | IBooking | any)[]
          total: number
          page: number
          limit: number
          totalPages: number
        }
      | PaginatedResult<BookingDocument | IBooking | any>,
  ): PaginatedResult<BookingResponseDto> {
    const items = 'data' in result ? result.data : result.items
    return {
      data: BookingMapper.toDtoList(items),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }
  }
}

export const toBookingResponse = BookingMapper.toDto
export const toBookingResponseList = BookingMapper.toDtoList
export const toBookingResponsePaginated = BookingMapper.toPaginatedDto
