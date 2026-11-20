import { Model } from 'mongoose';
import { IUser, UserDocument } from '../models/user.model';
import { IUserRepository } from '../interfaces/IUserRepository';
import { MongooseBaseRepository } from './base.repository';

export class MongooseUserRepository
  extends MongooseBaseRepository<UserDocument>
  implements IUserRepository
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
