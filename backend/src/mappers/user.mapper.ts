import { UserDocument, IUser } from '../models/user.model'
import { UserResponseDto } from '../dtos/user/user-response.dto'

export class UserMapper {
  static toDto(doc: UserDocument | IUser | any): UserResponseDto {
    const obj = typeof doc?.toJSON === 'function' ? doc.toJSON() : doc
    return {
      _id: obj._id?.toString() ?? '',
      name: obj.name ?? '',
      email: obj.email ?? '',
      role: obj.role ?? '',
      createdAt:
        obj.createdAt instanceof Date
          ? obj.createdAt.toISOString()
          : obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : '',
      updatedAt:
        obj.updatedAt instanceof Date
          ? obj.updatedAt.toISOString()
          : obj.updatedAt
            ? new Date(obj.updatedAt).toISOString()
            : '',
    }
  }

  static toDtoList(docs: (UserDocument | IUser | any)[]): UserResponseDto[] {
    return docs.map((doc) => UserMapper.toDto(doc))
  }
}
