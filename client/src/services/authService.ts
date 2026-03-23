import { apiRequest } from './api'
import type { AuthUser } from '../stores/authStore'

interface AuthResponse {
  token: string
  user: AuthUser
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(input: {
  email: string
  username: string
  birthDate: string
  password: string
  confirmPassword: string
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateProfile(input: {
  email?: string
  username?: string
  name?: string
  address?: string
  phone?: string
}): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function getMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me')
}

export async function verifyCurrentPassword(oldPassword: string): Promise<void> {
  await apiRequest<{ ok: boolean }>('/auth/verify-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword }),
  })
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await apiRequest<{ ok: boolean }>('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  })
}
