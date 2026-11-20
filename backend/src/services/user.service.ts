import jwt from 'jsonwebtoken'
import { IUserRepository } from '../interfaces/IUserRepository'
import { IEncryptionService } from '../interfaces/services/IEncryptionService'
import { RegisterUserDto } from '../dtos/user/register-user.dto'
import { LoginUserDto } from '../dtos/user/login-user.dto'
import { toUserResponse, UserResponseDto } from '../dtos/user/user-response.dto'
import { UserDocument } from '../models/user.model'
import { AppError } from '../errors/AppError'
import { ERRORS } from '../constants/errors.constant'
import { IUserService, LoginResult, AuthTokens } from '../interfaces/services/IUserService'

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jwtAccessSecret: string,
    private readonly jwtRefreshSecret: string,
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new AppError(409, ERRORS.USER.EMAIL_ALREADY_EXISTS)
    }

    const hashedPassword = await this.encryptionService.hashPassword(dto.password)

    const user = await this.userRepository.create({ ...dto, password: hashedPassword })

    return toUserResponse(user as UserDocument)
  }

  async login(dto: LoginUserDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new AppError(401, ERRORS.USER.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await this.encryptionService.comparePassword(dto.password, user.password)
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

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
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
