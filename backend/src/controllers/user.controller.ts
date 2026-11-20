import { Request, Response, NextFunction, CookieOptions } from 'express'
import { IUserService } from '../interfaces/services/IUserService'
import { sendResponse } from '../helpers/response.helper'
import { RESPONSE_MESSAGES } from '../constants/response-messages.constant'
import { HTTP_STATUS } from '../constants/http-status.constant'
import { env } from '../config/env'
import { registerUserSchema, loginUserSchema } from '../validators/user.validator'

export class UserController {
  constructor(
    private readonly userService: IUserService,
    private readonly cookieMaxAge: number = env.COOKIE_MAX_AGE,
  ) {}

  private get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.cookieMaxAge,
    }
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedDto = registerUserSchema.parse(req.body)
      const data = await this.userService.register(validatedDto)
      sendResponse(res, HTTP_STATUS.CREATED, RESPONSE_MESSAGES.USER.REGISTER_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedDto = loginUserSchema.parse(req.body)
      const { user, accessToken, refreshToken } = await this.userService.login(validatedDto)
      res.cookie('refresh_token', refreshToken, this.cookieOptions)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.USER.LOGIN_SUCCESS, { user, accessToken })
    } catch (err) {
      next(err)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenCookie = req.cookies?.refresh_token
      const { accessToken, refreshToken } = await this.userService.refreshToken(refreshTokenCookie)
      res.cookie('refresh_token', refreshToken, this.cookieOptions)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.USER.REFRESH_TOKEN_SUCCESS, { accessToken })
    } catch (err) {
      next(err)
    }
  }
}
