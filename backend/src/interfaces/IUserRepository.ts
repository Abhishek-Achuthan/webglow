import { BaseRepository } from './IBaseRepository';
import { IUser } from '../models/user.model';

export abstract class UserRepository extends BaseRepository<IUser> {
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findByUsername(username: string): Promise<IUser | null>;
}
