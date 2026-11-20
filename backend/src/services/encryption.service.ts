import * as bcrypt from 'bcrypt'
import { IEncryptionService } from '../interfaces/services/IEncryptionService'

export class EncryptionService implements IEncryptionService {
  private readonly saltRounds = 10

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
