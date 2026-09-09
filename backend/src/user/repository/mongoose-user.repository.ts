import { Model } from 'mongoose';
import { IUser, UserDocument } from '../schema/user.schema';
import { UserRepository } from './user.repository';
import { MongooseBaseRepository } from '../../common/repository/mongo/mongooseBase.repository';

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
