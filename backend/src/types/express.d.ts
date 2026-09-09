import { JwtPayload } from '../interfaces/ijwt-payload'

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
}
