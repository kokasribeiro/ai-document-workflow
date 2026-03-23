import type { UserRole } from '../auth/authStore'

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string
      email: string
      role: UserRole
    }
  }
}
