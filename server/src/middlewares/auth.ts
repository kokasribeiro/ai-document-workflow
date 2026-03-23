import type { NextFunction, Request, Response } from 'express'
import { getUserByToken } from '../auth/authStore'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const user = getUserByToken(token)
  if (!user) {
    res.status(401).json({ error: 'Invalid session' })
    return
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  }
  next()
}
