import { Router } from 'express'
import { BookingService } from '../services/booking.service'
import { sendResponse } from '../helpers/response.helper'
import { RESPONSE_MESSAGES } from '../constants/response-messages.constant'
import { ROUTES } from '../constants/routes.constant'
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware'
import { rolesMiddleware } from '../middlewares/roles.middleware'
import { ROLES } from '../constants/roles.constant'

export function createBookingRouter(service: BookingService): Router {
  const router = Router()

  router.post(
    `/${ROUTES.BOOKING.CREATE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.USER),
    async (req, res, next) => {
      try {
        const data = await service.createBooking(req.user!.sub, req.body)
        sendResponse(res, 201, RESPONSE_MESSAGES.BOOKING.CREATE_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  router.get(
    `/${ROUTES.BOOKING.MY_BOOKINGS}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.USER),
    async (req, res, next) => {
      try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
        const data = await service.getMyBookings(req.user!.sub, page, limit)
        sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.MY_LIST_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  router.get(`/${ROUTES.BOOKING.AVAILABLE_DATES}`, async (req, res, next) => {
    try {
      const { serviceId } = req.params as { serviceId: string }
      const data = await service.getAvailableDates(serviceId)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.AVAILABLE_DATES_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  })

  router.get(
    `/${ROUTES.BOOKING.PROVIDER_BOOKINGS}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    async (req, res, next) => {
      try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
        const data = await service.getProviderBookings(req.user!.sub, page, limit)
        sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.PROVIDER_LIST_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  router.get(
    `/${ROUTES.BOOKING.ADMIN_BOOKINGS}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.ADMIN),
    async (req, res, next) => {
      try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10
        const data = await service.getAllBookings(page, limit)
        sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.ADMIN_LIST_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  router.patch(
    `/${ROUTES.BOOKING.CANCEL}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.USER),
    async (req, res, next) => {
      try {
        const { id } = req.params as { id: string }
        const data = await service.cancelBooking(id, req.user!.sub)
        sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.CANCEL_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  return router
}
