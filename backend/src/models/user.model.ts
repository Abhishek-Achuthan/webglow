import mongoose, { HydratedDocument } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export type UserDocument = HydratedDocument<IUser>

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
  },
  { timestamps: true },
)

export const UserModel = mongoose.model<IUser, mongoose.Model<UserDocument>>('User', userSchema)
