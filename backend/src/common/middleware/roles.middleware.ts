import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import { ERRORS } from '../constants/errors.constant'
import { ROLES } from '../constants/roles.constant'

export function rolesMiddleware(
  ...roles: ROLES[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user

    if (!user || !user.role) {
      return next(new AppError(403, ERRORS.AUTH.NO_ROLE_FOUND))
    }

    if (!roles.includes(user.role as ROLES)) {
      return next(new AppError(403, ERRORS.AUTH.INSUFFICIENT_PERMISSIONS))
    }

    next()
  }
}
