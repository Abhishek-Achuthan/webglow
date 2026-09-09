import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ZodError } from 'zod'

import { UserModel } from './models/user.model'
import { MongooseUserRepository } from './repositories/user.repository'
import { EncryptionService } from './services/encryption.service'
import { UserService } from './services/user.service'
import { createUserRouter } from './controllers/user.controller'
import { ProviderServiceModel } from './models/provider-service.model'
import { MongooseProviderServiceRepository } from './repositories/provider-service.repository'
import { ProviderServiceService } from './services/provider-service.service'
import { createProviderServiceRouter } from './controllers/provider-service.controller'
import { BookingModel } from './models/booking.model'
import { MongooseBookingRepository } from './repositories/booking.repository'
import { BookingService } from './services/booking.service'
import { createBookingRouter } from './controllers/booking.controller'
import { AppError } from './errors/AppError'
import { sendResponse } from './helpers/response.helper'
import { ROUTES } from './constants/routes.constant'
import { env } from './config/env'

export function createApp(): express.Application {
  const app = express()

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use(cookieParser())

  const encryptionService = new EncryptionService()
  const userRepository = new MongooseUserRepository(UserModel)
  const userService = new UserService(
    userRepository,
    encryptionService,
    env.JWT_ACCESS_SECRET,
    env.JWT_REFRESH_SECRET,
  )
  const userRouter = createUserRouter(userService)

  const providerServiceRepository = new MongooseProviderServiceRepository(ProviderServiceModel)
  const providerServiceService = new ProviderServiceService(providerServiceRepository)
  const providerServiceRouter = createProviderServiceRouter(providerServiceService)

  const bookingRepository = new MongooseBookingRepository(BookingModel)
  const bookingService = new BookingService(bookingRepository, providerServiceService)
  const bookingRouter = createBookingRouter(bookingService)

  app.use(`/${ROUTES.USER.BASE}`, userRouter)
  app.use(`/${ROUTES.PROVIDER_SERVICE.BASE}`, providerServiceRouter)
  app.use(`/${ROUTES.BOOKING.BASE}`, bookingRouter)

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
