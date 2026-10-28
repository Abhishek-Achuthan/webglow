import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { ROUTES } from '../constants/routes.constant'

export function createUserRouter(controller: UserController): Router {
  const router = Router()

  router.post(`/${ROUTES.USER.REGISTER}`, controller.register)
  router.post(`/${ROUTES.USER.LOGIN}`, controller.login)
  router.post(`/${ROUTES.USER.REFRESH_TOKEN}`, controller.refreshToken)

  return router
}
