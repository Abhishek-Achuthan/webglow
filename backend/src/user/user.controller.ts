import { Router } from 'express'
import { UserService } from './user.service'
import { sendResponse } from '../common/helpers/response.helper'
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant'
import { ROUTES } from '../common/constants/routes.constant'

export function createUserRouter(userService: UserService): Router {
  const router = Router()

  router.post(`/${ROUTES.USER.REGISTER}`, async (req, res, next) => {
    try {
      const data = await userService.register(req.body)
      sendResponse(res, 201, RESPONSE_MESSAGES.USER.REGISTER_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  })

  router.post(`/${ROUTES.USER.LOGIN}`, async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await userService.login(req.body)
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
  })

  router.post(`/${ROUTES.USER.REFRESH_TOKEN}`, async (req, res, next) => {
    try {
      const refreshTokenCookie = req.cookies?.refresh_token
      const { accessToken, refreshToken } = await userService.refreshToken(refreshTokenCookie)
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
  })

  return router
}
