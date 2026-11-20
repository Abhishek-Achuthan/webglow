import { UserModel } from '../models/user.model'
import { IUserRepository } from '../interfaces/IUserRepository'
import { MongooseUserRepository } from '../repositories/user.repository'
import { IEncryptionService } from '../interfaces/services/IEncryptionService'
import { EncryptionService } from '../services/encryption.service'
import { IUserService } from '../interfaces/services/IUserService'
import { UserService } from '../services/user.service'
import { UserController } from '../controllers/user.controller'
import { env } from '../config/env'

export interface UserDependencies {
  userRepository: IUserRepository
  encryptionService: IEncryptionService
  userService: IUserService
  userController: UserController
}

export function createUserContainer(): UserDependencies {
  const encryptionService: IEncryptionService = new EncryptionService()
  const userRepository: IUserRepository = new MongooseUserRepository(UserModel)
  const userService: IUserService = new UserService(
    userRepository,
    encryptionService,
    env.JWT_ACCESS_SECRET,
    env.JWT_REFRESH_SECRET,
  )
  const userController = new UserController(userService, env.COOKIE_MAX_AGE)

  return {
    userRepository,
    encryptionService,
    userService,
    userController,
  }
}
