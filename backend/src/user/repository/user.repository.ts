import { BaseRepository } from '../../common/repository/base.repository';
import { IUser } from '../schema/user.schema';

export abstract class UserRepository extends BaseRepository<IUser> {
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findByUsername(username: string): Promise<IUser | null>;
}
