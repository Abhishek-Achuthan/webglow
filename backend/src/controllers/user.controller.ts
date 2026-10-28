import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service'
import { sendResponse } from '../helpers/response.helper'
import { RESPONSE_MESSAGES } from '../constants/response-messages.constant'

export class UserController {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.userService.register(req.body)
      sendResponse(res, 201, RESPONSE_MESSAGES.USER.REGISTER_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, refreshToken } = await this.userService.login(req.body)
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      sendResponse(res, 200, RESPONSE_MESSAGES.USER.LOGIN_SUCCESS, { user, accessToken })
    } catch (err) {
      next(err)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenCookie = req.cookies?.refresh_token
      const { accessToken, refreshToken } = await this.userService.refreshToken(refreshTokenCookie)
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      sendResponse(res, 200, RESPONSE_MESSAGES.USER.REFRESH_TOKEN_SUCCESS, { accessToken })
    } catch (err) {
      next(err)
    }
  }
}
