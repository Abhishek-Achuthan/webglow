import { Router } from 'express'
import { BookingService } from './booking.service'
import { sendResponse } from '../common/helpers/response.helper'
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant'
import { ROUTES } from '../common/constants/routes.constant'
import { jwtAuthMiddleware } from '../common/middleware/jwtAuth.middleware'
import { rolesMiddleware } from '../common/middleware/roles.middleware'
import { ROLES } from '../common/constants/roles.constant'

export function createBookingRouter(service: BookingService): Router {
  const router = Router()

  // POST / — Create booking (USER)
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

  // GET /my — My bookings (USER) — must be before /:id patterns
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

  // GET /available-dates/:serviceId — Public, no auth — must be before /:id patterns
  router.get(`/${ROUTES.BOOKING.AVAILABLE_DATES}`, async (req, res, next) => {
    try {
      const { serviceId } = req.params as { serviceId: string }
      const data = await service.getAvailableDates(serviceId)
      sendResponse(res, 200, RESPONSE_MESSAGES.BOOKING.AVAILABLE_DATES_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  })

  // GET /provider — Provider bookings (PROVIDER) — must be before /:id patterns
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

  // GET /admin — Admin bookings (ADMIN) — must be before /:id patterns
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

  // PATCH /:id/cancel — Cancel booking (USER)
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
