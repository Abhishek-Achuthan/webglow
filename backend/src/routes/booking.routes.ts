import { Router } from 'express'
import { BookingController } from '../controllers/booking.controller'
import { ROUTES } from '../constants/routes.constant'
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware'
import { rolesMiddleware } from '../middlewares/roles.middleware'
import { ROLES } from '../constants/roles.constant'

export function createBookingRouter(controller: BookingController): Router {
  const router = Router()

  router.post(
    `/${ROUTES.BOOKING.CREATE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.USER),
    controller.createBooking,
  )

  router.get(
    `/${ROUTES.BOOKING.MY_BOOKINGS}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.USER),
    controller.getMyBookings,
  )

  router.get(`/${ROUTES.BOOKING.AVAILABLE_DATES}`, controller.getAvailableDates)

  router.get(
    `/${ROUTES.BOOKING.PROVIDER_BOOKINGS}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    controller.getProviderBookings,
  )

  router.get(
    `/${ROUTES.BOOKING.ADMIN_BOOKINGS}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.ADMIN),
    controller.getAllBookings,
  )

  router.patch(
    `/${ROUTES.BOOKING.CANCEL}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.USER),
    controller.cancelBooking,
  )

  return router
}
