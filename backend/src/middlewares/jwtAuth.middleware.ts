import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError'
import { ERRORS } from '../constants/errors.constant'
import { JwtPayload } from '../interfaces/ijwt-payload'

export function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization
  const [type, token] = authHeader?.split(' ') ?? []

  if (type !== 'Bearer' || !token) {
    return next(new AppError(401, ERRORS.AUTH.TOKEN_MISSING))
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload
    req.user = payload
    next()
  } catch {
    next(new AppError(401, ERRORS.AUTH.INVALID_TOKEN))
  }
}
