import { UserDocument } from '../../models/user.model'
import { UserMapper } from '../../mappers/user.mapper'

export interface UserResponseDto {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string | Date
  updatedAt: string | Date
}

export function toUserResponse(doc: UserDocument): UserResponseDto {
  return UserMapper.toDto(doc)
}
