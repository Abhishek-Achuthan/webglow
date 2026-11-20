import { BookingModel } from '../models/booking.model'
import { IBookingRepository } from '../interfaces/IBookingRepository'
import { MongooseBookingRepository } from '../repositories/booking.repository'
import { IBookingService } from '../interfaces/services/IBookingService'
import { BookingService } from '../services/booking.service'
import { BookingController } from '../controllers/booking.controller'
import { IProviderServiceService } from '../interfaces/services/IProviderServiceService'

export interface BookingDependencies {
  bookingRepository: IBookingRepository
  bookingService: IBookingService
  bookingController: BookingController
}

export function createBookingContainer(
  providerServiceService: IProviderServiceService,
): BookingDependencies {
  const bookingRepository: IBookingRepository = new MongooseBookingRepository(BookingModel)
  const bookingService: IBookingService = new BookingService(
    bookingRepository,
    providerServiceService,
  )
  const bookingController = new BookingController(bookingService)

  return {
    bookingRepository,
    bookingService,
    bookingController,
  }
}
