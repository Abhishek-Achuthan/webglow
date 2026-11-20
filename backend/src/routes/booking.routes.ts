import { Router } from 'express'
import { bookingController } from '../container'
import { ROUTES } from '../constants/routes.constant'
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware'
import { rolesMiddleware } from '../middlewares/roles.middleware'
import { ROLES } from '../constants/roles.constant'

const router = Router()

router.post(
  ROUTES.BOOKING.CREATE,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.USER),
  bookingController.createBooking,
)

router.get(
  ROUTES.BOOKING.MY_BOOKINGS,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.USER),
  bookingController.getMyBookings,
)

router.get(ROUTES.BOOKING.AVAILABLE_DATES, bookingController.getAvailableDates)

router.get(
  ROUTES.BOOKING.PROVIDER_BOOKINGS,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.PROVIDER),
  bookingController.getProviderBookings,
)

router.get(
  ROUTES.BOOKING.ADMIN_BOOKINGS,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.ADMIN),
  bookingController.getAllBookings,
)

router.patch(
  ROUTES.BOOKING.CANCEL,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.USER),
  bookingController.cancelBooking,
)

export default router
