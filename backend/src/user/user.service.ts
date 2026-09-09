import jwt from 'jsonwebtoken'
import { UserRepository } from './repository/user.repository'
import { EncryptionService } from '../common/encryption/encryption.service'
import { registerUserSchema } from './dto/register-user.dto'
import { loginUserSchema } from './dto/login-user.dto'
import { toUserResponse } from './dto/user-response.dto'
import { UserDocument } from './schema/user.schema'
import { AppError } from '../common/errors/AppError'
import { ERRORS } from '../common/constants/errors.constant'

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly jwtAccessSecret: string,
    private readonly jwtRefreshSecret: string,
  ) {}

  async register(dto: unknown) {
    const parsed = registerUserSchema.parse(dto)

    const existingUser = await this.userRepository.findByEmail(parsed.email)
    if (existingUser) {
      throw new AppError(409, ERRORS.USER.EMAIL_ALREADY_EXISTS)
    }

    const hashedPassword = await this.encryptionService.hashPassword(parsed.password)

    const user = await this.userRepository.create({ ...parsed, password: hashedPassword })

    return toUserResponse(user as UserDocument)
  }

  async login(dto: unknown) {
    const parsed = loginUserSchema.parse(dto)

    const user = await this.userRepository.findByEmail(parsed.email)
    if (!user) {
      throw new AppError(401, ERRORS.USER.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await this.encryptionService.comparePassword(parsed.password, user.password)
    if (!isPasswordValid) {
      throw new AppError(401, ERRORS.USER.INVALID_CREDENTIALS)
    }

    const userObj = (user as UserDocument).toJSON() as any

    const payload = {
      sub: userObj._id.toString(),
      email: userObj.email,
      role: userObj.role,
    }

    const accessToken = jwt.sign(payload, this.jwtAccessSecret, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '7d' })

    return {
      user: toUserResponse(user as UserDocument),
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError(401, ERRORS.USER.REFRESH_TOKEN_REQUIRED)
    }

    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as { sub: string; email: string; role: string }

      const user = await this.userRepository.findById(decoded.sub)
      if (!user) {
        throw new AppError(401, ERRORS.USER.USER_NOT_FOUND)
      }

      const userObj = (user as UserDocument).toJSON() as any

      const payload = {
        sub: userObj._id.toString(),
        email: userObj.email,
        role: userObj.role,
      }

      const accessToken = jwt.sign(payload, this.jwtAccessSecret, { expiresIn: '15m' })
      const newRefreshToken = jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '7d' })

      return { accessToken, refreshToken: newRefreshToken }
    } catch (err) {
      if (err instanceof AppError) {
        throw err
      }
      throw new AppError(401, ERRORS.USER.INVALID_REFRESH_TOKEN)
    }
  }
}
