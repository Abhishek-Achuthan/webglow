import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserService } from '../services/user.service'
import { MongooseUserRepository } from '../repositories/user.repository'
import { UserModel } from '../models/user.model'
import { EncryptionService } from '../services/encryption.service'
import { ROUTES } from '../constants/routes.constant'
import { env } from '../config/env'

const encryptionService = new EncryptionService()
const userRepository = new MongooseUserRepository(UserModel)
const userService = new UserService(
  userRepository,
  encryptionService,
  env.JWT_ACCESS_SECRET,
  env.JWT_REFRESH_SECRET,
)
const userController = new UserController(userService)

const router = Router()

router.post(`/${ROUTES.USER.REGISTER}`, userController.register)
router.post(`/${ROUTES.USER.LOGIN}`, userController.login)
router.post(`/${ROUTES.USER.REFRESH_TOKEN}`, userController.refreshToken)

export default router
