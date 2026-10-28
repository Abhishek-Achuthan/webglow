import { Request, Response, NextFunction } from 'express'
import { BookingService } from '../services/booking.service'
import { sendResponse } from '../helpers/response.helper'
import { RESPONSE_MESSAGES } from '../constants/response-messages.constant'

export class BookingController {
  constructor(private readonly service: BookingService) {}

  createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.createBooking(req.user!.sub, req.body)
      sendResponse(res, 201, RESPONSE_MESSAGES.BOOKING.CREATE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
      const data = await this.service.getMyBookings(req.user!.sub, page, limit)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.MY_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getAvailableDates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { serviceId } = req.params as { serviceId: string }
      const data = await this.service.getAvailableDates(serviceId)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.AVAILABLE_DATES_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getProviderBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
      const data = await this.service.getProviderBookings(req.user!.sub, page, limit)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.PROVIDER_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getAllBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
      const data = await this.service.getAllBookings(page, limit)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.ADMIN_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const data = await this.service.cancelBooking(id, req.user!.sub)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.CANCEL_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }
}
