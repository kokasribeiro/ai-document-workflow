import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

const SALT_ROUNDS = 10

type UserRole = 'CEO' | 'USER'

interface AppUser {
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

interface CreateUserInput {
  email: string
  username: string
  birthDate: string
  password: string
}

interface UpdateProfileInput {
  email?: string
  username?: string
  name?: string
  address?: string
  phone?: string
}

function mapRole(role: string): UserRole {
  return role === 'CEO' ? 'CEO' : 'USER'
}

function mapUser(user: {
  id: string
  email: string
  username: string
  birthDate: Date
  name: string
  address: string
  phone: string
  password: string
  role: string
}): AppUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    birthDate: user.birthDate.toISOString().slice(0, 10),
    name: user.name,
    address: user.address,
    phone: user.phone,
    password: user.password,
    role: mapRole(user.role),
  }
}

export async function ensureSeedCeo(): Promise<void> {
  const ceoEmail = (process.env.CEO_EMAIL ?? 'ceo@gmail.com').trim().toLowerCase()
  const ceoUsername = (process.env.CEO_USERNAME ?? 'ceo').trim().toLowerCase()
  const ceoBirthDate = process.env.CEO_BIRTHDATE ?? '1990-01-01'
  const ceoName = process.env.CEO_NAME ?? 'Chief Executive Officer'
  const ceoPassword = process.env.CEO_PASSWORD ?? 'test123'

  const existingCeo = await prisma.user.findFirst({
    where: { OR: [{ role: 'CEO' }, { email: ceoEmail }] },
  })

  if (existingCeo) {
    await prisma.user.update({
      where: { id: existingCeo.id },
      data: {
        email: ceoEmail,
        username: ceoUsername,
        birthDate: new Date(ceoBirthDate),
        name: ceoName,
        role: 'CEO',
      },
    })
    return
  }

  const hashedPassword = await bcrypt.hash(ceoPassword, SALT_ROUNDS)
  await prisma.user.create({
    data: {
      email: ceoEmail,
      username: ceoUsername,
      birthDate: new Date(ceoBirthDate),
      name: ceoName,
      address: '',
      phone: '',
      password: hashedPassword,
      role: 'CEO',
    },
  })
}

export async function createUser(input: CreateUserInput): Promise<AppUser> {
  if (input.username.trim().toLowerCase() === 'ceo') {
    throw new Error('Username "ceo" is reserved')
  }
  const email = input.email.toLowerCase()
  const username = input.username.toLowerCase()
  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) throw new Error('Email already registered')
  const existingUsername = await prisma.user.findUnique({ where: { username } })
  if (existingUsername) throw new Error('Username already registered')
  try {
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        email,
        username,
        birthDate: new Date(input.birthDate),
        name: '',
        address: '',
        phone: '',
        password: hashedPassword,
        role: 'USER',
      },
    })
    return mapUser(user)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(',') : ''
      if (target.includes('email')) throw new Error('Email already registered')
      if (target.includes('username')) throw new Error('Username already registered')
    }
    throw error
  }
}

export async function getUserById(userId: string): Promise<AppUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user ? mapUser(user) : null
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<AppUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')
  const previousEmail = user.email

  if (input.email && input.email.toLowerCase() !== user.email.toLowerCase()) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    })
    if (existing) throw new Error('Email already registered')
  }

  let normalizedUsername: string | undefined
  if (input.username !== undefined) {
    if (input.username.trim().toLowerCase() === 'ceo') {
      throw new Error('Username "ceo" is reserved')
    }
    normalizedUsername = input.username.toLowerCase()
    if (normalizedUsername !== user.username.toLowerCase()) {
      const existing = await prisma.user.findUnique({ where: { username: normalizedUsername } })
      if (existing) throw new Error('Username already registered')
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      email: input.email !== undefined ? input.email.toLowerCase() : undefined,
      username: normalizedUsername,
      name: input.name,
      address: input.address,
      phone: input.phone,
    },
  })

  // Keep document ownership aligned after email change.
  if (input.email !== undefined && input.email.toLowerCase() !== previousEmail.toLowerCase()) {
    await prisma.document.updateMany({
      where: { ownerEmail: previousEmail },
      data: { ownerEmail: input.email.toLowerCase() },
    })
  }

  return mapUser(updated)
}

export async function verifyUserPassword(userId: string, oldPassword: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false
  return bcrypt.compare(oldPassword, user.password)
}

export async function changeUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')
  const valid = await bcrypt.compare(oldPassword, user.password)
  if (!valid) throw new Error('invalid password')
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

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

export async function authenticate(email: string, password: string): Promise<AppUser | null> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return null
  const valid = await bcrypt.compare(password, user.password)
  return valid ? mapUser(user) : null
}

export async function createSession(userId: string): Promise<{ token: string; userId: string }> {
  const session = await prisma.session.create({
    data: { userId, token: crypto.randomUUID() },
  })
  return { token: session.token, userId: session.userId }
}

export async function getUserByToken(token: string): Promise<AppUser | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })
  if (!session) return null
  return mapUser(session.user)
}
