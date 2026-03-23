import { randomUUID } from 'crypto'

export type UserRole = 'CEO' | 'USER'

export interface AppUser {
  id: string
  email: string
  password: string
  role: UserRole
}

export interface AppSession {
  token: string
  userId: string
}

const users: AppUser[] = [
  {
    id: randomUUID(),
    email: 'ceo@gmail.com',
    password: 'test123',
    role: 'CEO',
  },
]

const sessions: AppSession[] = []

export function createUser(email: string, password: string): AppUser {
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existing) throw new Error('Email already registered')
  const user: AppUser = {
    id: randomUUID(),
    email,
    password,
    role: 'USER',
  }
  users.push(user)
  return user
}

export function authenticate(email: string, password: string): AppUser | null {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password) ?? null
}

export function createSession(userId: string): AppSession {
  const session: AppSession = {
    token: randomUUID(),
    userId,
  }
  sessions.push(session)
  return session
}

export function getUserByToken(token: string): AppUser | null {
  const session = sessions.find((s) => s.token === token)
  if (!session) return null
  return users.find((u) => u.id === session.userId) ?? null
}
