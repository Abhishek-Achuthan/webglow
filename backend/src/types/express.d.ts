import { JwtPayload } from '../interfaces/IJwtPayload'

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
}
