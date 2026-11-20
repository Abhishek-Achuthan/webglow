import { ROLES } from '../../constants/roles.constant'

export interface RegisterUserDto {
  name: string
  email: string
  password: string
  role?: ROLES
}
