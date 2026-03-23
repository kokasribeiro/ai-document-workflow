import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  authenticate,
  createSession,
  createUser,
  getUserByToken,
} from '../auth/authStore'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function register(req: Request, res: Response): void {
  const parsed = authSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  try {
    const user = createUser(parsed.data.email, parsed.data.password)
    const session = createSession(user.id)
    res.status(201).json({
      token: session.token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Register failed'
    res.status(400).json({ error: message })
  }
}

export function login(req: Request, res: Response): void {
  const parsed = authSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  const user = authenticate(parsed.data.email, parsed.data.password)
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }
  const session = createSession(user.id)
  res.json({
    token: session.token,
    user: { id: user.id, email: user.email, role: user.role },
  })
}

export function me(req: Request, res: Response): void {
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
  res.json({ id: user.id, email: user.email, role: user.role })
}
