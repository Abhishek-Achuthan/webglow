import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { z } from 'zod'

import userRouter from './routes/user.routes'
import providerServiceRouter from './routes/provider-service.routes'
import bookingRouter from './routes/booking.routes'
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

  app.use(`/${ROUTES.USER.BASE}`, userRouter)
  app.use(`/${ROUTES.PROVIDER_SERVICE.BASE}`, providerServiceRouter)
  app.use(`/${ROUTES.BOOKING.BASE}`, bookingRouter)

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
      sendResponse(res, err.statusCode, err.message, null)
      return
    }

    if (err instanceof z.ZodError) {
      const message = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      sendResponse(res, 400, message, null)
      return
    }

    const message =
      process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    sendResponse(res, 500, message, null)
  })

  return app
}
