import { BookingStatus } from '../../models/booking.model'
export {
  BookingMapper,
  toBookingResponse,
  toBookingResponseList,
  toBookingResponsePaginated,
} from '../../mappers/booking.mapper'

export interface PopulatedUserSummaryDto {
  _id: string
  name: string
  email: string
}

export interface PopulatedServiceSummaryDto {
  _id: string
  title: string
  category: string
  pricePerDay?: number
}

export interface BookingResponseDto {
  _id: string
  userId: string | PopulatedUserSummaryDto
  serviceId: string | PopulatedServiceSummaryDto
  providerId: string | PopulatedUserSummaryDto
  startDate: string
  endDate: string
  numberOfDays: number
  pricePerDay: number
  totalAmount: number
  status: BookingStatus
  createdAt: string
  updatedAt: string
}
