import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ZodError } from 'zod'

import { UserModel } from './user/schema/user.schema'
import { MongooseUserRepository } from './user/repository/mongoose-user.repository'
import { EncryptionService } from './common/encryption/encryption.service'
import { UserService } from './user/user.service'
import { createUserRouter } from './user/user.controller'
import { ProviderServiceModel } from './provider-service/schema/provider-service.schema'
import { MongooseProviderServiceRepository } from './provider-service/repository/mongoose-provider-service.repository'
import { ProviderServiceService } from './provider-service/provider-service.service'
import { createProviderServiceRouter } from './provider-service/provider-service.controller'
import { BookingModel } from './booking/schema/booking.schema'
import { MongooseBookingRepository } from './booking/repository/mongoose-booking.repository'
import { BookingService } from './booking/booking.service'
import { createBookingRouter } from './booking/booking.controller'
import { AppError } from './common/errors/AppError'
import { sendResponse } from './common/helpers/response.helper'
import { ROUTES } from './common/constants/routes.constant'

export function createApp(): express.Application {
  const app = express()

  // Global middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use(cookieParser())

  // Instantiate dependencies
  const encryptionService = new EncryptionService()
  const userRepository = new MongooseUserRepository(UserModel)
  const userService = new UserService(
    userRepository,
    encryptionService,
    process.env.JWT_ACCESS_SECRET ?? '',
    process.env.JWT_REFRESH_SECRET ?? '',
  )
  const userRouter = createUserRouter(userService)

  const providerServiceRepository = new MongooseProviderServiceRepository(ProviderServiceModel)
  const providerServiceService = new ProviderServiceService(providerServiceRepository)
  const providerServiceRouter = createProviderServiceRouter(providerServiceService)

  const bookingRepository = new MongooseBookingRepository(BookingModel)
  const bookingService = new BookingService(bookingRepository, providerServiceService)
  const bookingRouter = createBookingRouter(bookingService)

  // Mount routers
  app.use(`/${ROUTES.USER.BASE}`, userRouter)
  app.use(`/${ROUTES.PROVIDER_SERVICE.BASE}`, providerServiceRouter)
  app.use(`/${ROUTES.BOOKING.BASE}`, bookingRouter)

  // Global error handler (4-arg — must be last)
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
      sendResponse(res, err.statusCode, err.message, null)
      return
    }

    if (err instanceof ZodError) {
      const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      sendResponse(res, 400, message, null)
      return
    }

    const message =
      process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    sendResponse(res, 500, message, null)
  })

  return app
}
