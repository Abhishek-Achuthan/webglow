import { Router } from 'express'
import { userController } from '../container'
import { ROUTES } from '../constants/routes.constant'

const router = Router()

router.post(ROUTES.USER.REGISTER, userController.register)
router.post(ROUTES.USER.LOGIN, userController.login)
router.post(ROUTES.USER.REFRESH_TOKEN, userController.refreshToken)

export default router
