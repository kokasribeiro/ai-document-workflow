import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  authenticate,
  changeUserPassword,
  createSession,
  createUser,
  getUserById,
  updateUserProfile,
  verifyUserPassword,
} from '../auth/authStore'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3),
    birthDate: z.string().min(1),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const profileSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
})

const verifyPasswordSchema = z.object({
  oldPassword: z.string().min(1),
})

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
})

function isAdult(birthDate: string): boolean {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return false
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--
  return age >= 18
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  if (!isAdult(parsed.data.birthDate)) {
    res.status(400).json({ error: 'User must be at least 18 years old' })
    return
  }
  try {
    const user = await createUser({
      email: parsed.data.email,
      username: parsed.data.username,
      birthDate: parsed.data.birthDate,
      password: parsed.data.password,
    })
    const session = await createSession(user.id)
    res.status(201).json({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        address: user.address,
        phone: user.phone,
        birthDate: user.birthDate,
        role: user.role,
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Register failed'
    res.status(400).json({ error: message })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  const user = await authenticate(parsed.data.email, parsed.data.password)
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }
  const session = await createSession(user.id)
  res.json({
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      address: user.address,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
    },
  })
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user?.id) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const user = await getUserById(req.user.id)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    address: user.address,
    phone: user.phone,
    birthDate: user.birthDate,
    role: user.role,
  })
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  if (!req.user?.id) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const parsed = profileSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  try {
    const updateData =
      req.user.role === 'CEO'
        ? {
            email: parsed.data.email,
            name: parsed.data.name,
            address: parsed.data.address,
            phone: parsed.data.phone,
          }
        : {
            email: parsed.data.email,
            username: parsed.data.username,
            address: parsed.data.address,
            phone: parsed.data.phone,
          }

    const user = await updateUserProfile(req.user.id, updateData)
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      address: user.address,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Profile update failed'
    res.status(400).json({ error: message })
  }
}

export async function verifyPassword(req: Request, res: Response): Promise<void> {
  if (!req.user?.id) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const parsed = verifyPasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  const isValid = await verifyUserPassword(req.user.id, parsed.data.oldPassword)
  if (!isValid) {
    res.status(400).json({ error: 'invalid password' })
    return
  }
  res.json({ ok: true })
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  if (!req.user?.id) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const parsed = changePasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' })
    return
  }
  try {
    await changeUserPassword(req.user.id, parsed.data.oldPassword, parsed.data.newPassword)
    res.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Password change failed'
    res.status(400).json({ error: message })
  }
}
