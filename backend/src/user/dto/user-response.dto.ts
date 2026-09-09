import { UserDocument } from '../schema/user.schema'

export function toUserResponse(doc: UserDocument) {
  const obj = doc.toJSON() as any
  return {
    _id: obj._id?.toString(),
    name: obj.name as string,
    email: obj.email as string,
    role: obj.role as string,
    createdAt: obj.createdAt as Date,
    updatedAt: obj.updatedAt as Date,
  }
}
