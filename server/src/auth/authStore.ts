import { randomUUID } from 'crypto'
import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

dotenv.config()

export type UserRole = 'CEO' | 'USER'

export interface AppUser {
  id: string
  email: string
  username: string
  birthDate: string
  name: string
  address: string
  phone: string
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
    email: process.env.CEO_EMAIL ?? 'ceo@gmail.com',
    username: process.env.CEO_USERNAME ?? 'ceo',
    birthDate: process.env.CEO_BIRTHDATE ?? '1990-01-01',
    name: process.env.CEO_NAME ?? 'Chief Executive Officer',
    address: '',
    phone: '',
    password: process.env.CEO_PASSWORD ?? 'test123',
    role: 'CEO',
  },
]

const sessions: AppSession[] = []

export interface CreateUserInput {
  email: string
  username: string
  birthDate: string
  password: string
}

export interface UpdateProfileInput {
  email?: string
  name?: string
  address?: string
  phone?: string
}

export function createUser(input: CreateUserInput): AppUser {
  if (input.username.trim().toLowerCase() === 'ceo') {
    throw new Error('Username "ceo" is reserved')
  }
  const existingEmail = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
  if (existingEmail) throw new Error('Email already registered')
  const existingUsername = users.find((u) => u.username.toLowerCase() === input.username.toLowerCase())
  if (existingUsername) throw new Error('Username already registered')
  const user: AppUser = {
    id: randomUUID(),
    email: input.email,
    username: input.username,
    birthDate: input.birthDate,
    name: '',
    address: '',
    phone: '',
    password: input.password,
    role: 'USER',
  }
  users.push(user)
  return user
}

export function getUserById(userId: string): AppUser | null {
  return users.find((u) => u.id === userId) ?? null
}

export function updateUserProfile(userId: string, input: UpdateProfileInput): AppUser {
  const user = users.find((u) => u.id === userId)
  if (!user) throw new Error('User not found')

  if (input.email && input.email.toLowerCase() !== user.email.toLowerCase()) {
    const existing = users.find((u) => u.email.toLowerCase() === input.email!.toLowerCase())
    if (existing) throw new Error('Email already registered')
  }

  if (input.email !== undefined) user.email = input.email
  if (input.name !== undefined) user.name = input.name
  if (input.address !== undefined) user.address = input.address
  if (input.phone !== undefined) user.phone = input.phone

  return user
}

export function verifyUserPassword(userId: string, oldPassword: string): boolean {
  const user = users.find((u) => u.id === userId)
  if (!user) return false
  return user.password === oldPassword
}

export function changeUserPassword(userId: string, oldPassword: string, newPassword: string): void {
  const user = users.find((u) => u.id === userId)
  if (!user) throw new Error('User not found')
  if (user.password !== oldPassword) throw new Error('invalid password')
  user.password = newPassword

  if (user.role === 'CEO') {
    persistCeoPasswordToEnv(newPassword)
  }
}

function persistCeoPasswordToEnv(newPassword: string): void {
  const envPath = path.resolve(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf8')
  const escaped = newPassword.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const line = `CEO_PASSWORD="${escaped}"`
  const hasKey = /^CEO_PASSWORD=.*$/m.test(envContent)
  const updated = hasKey
    ? envContent.replace(/^CEO_PASSWORD=.*$/m, line)
    : `${envContent.trimEnd()}\n${line}\n`

  writeFileSync(envPath, updated, 'utf8')
  process.env.CEO_PASSWORD = newPassword
}

export function authenticate(email: string, password: string): AppUser | null {
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password) ??
    null
  )
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
