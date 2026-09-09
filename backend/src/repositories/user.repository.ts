import { Model } from 'mongoose';
import { IUser, UserDocument } from '../models/user.model';
import { UserRepository } from '../interfaces/iuser.repository';
import { MongooseBaseRepository } from './base.repository';

export class MongooseUserRepository
  extends MongooseBaseRepository<UserDocument>
  implements UserRepository
{
  constructor(model: Model<UserDocument>) {
    super(model);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.model.findOne({ name: username }).exec();
  }
}
