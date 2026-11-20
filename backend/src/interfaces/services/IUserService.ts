import type { RegisterUserDto } from '../../dtos/user/register-user.dto'
import type { LoginUserDto } from '../../dtos/user/login-user.dto'
import type { UserResponseDto } from '../../dtos/user/user-response.dto'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResult extends AuthTokens {
  user: UserResponseDto
}

export interface IUserService {
  register(dto: RegisterUserDto): Promise<UserResponseDto>
  login(dto: LoginUserDto): Promise<LoginResult>
  refreshToken(refreshToken: string): Promise<AuthTokens>
}
