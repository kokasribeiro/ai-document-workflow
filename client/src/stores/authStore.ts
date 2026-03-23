import { defineStore } from 'pinia'
import { login, register, updateProfile } from '../services/authService'

export type UserRole = 'CEO' | 'USER'

export interface AuthUser {
  id: string
  email: string
  username: string
  name: string
  address: string
  phone: string
  birthDate: string
  role: UserRole
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') ?? '',
    user: (localStorage.getItem('auth_user')
      ? JSON.parse(localStorage.getItem('auth_user') as string)
      : null) as AuthUser | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    isCEO: (state) => state.user?.role === 'CEO',
  },
  actions: {
    setSession(token: string, user: AuthUser) {
      this.token = token
      this.user = user
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    },
    clearSession() {
      this.token = ''
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
    async signIn(email: string, password: string) {
      const data = await login(email, password)
      this.setSession(data.token, data.user)
    },
    async signUp(input: {
      email: string
      username: string
      birthDate: string
      password: string
      confirmPassword: string
    }) {
      const data = await register(input)
      this.setSession(data.token, data.user)
    },
    async saveProfile(input: { username?: string; name?: string; address?: string; phone?: string }) {
      const user = await updateProfile(input)
      if (this.token) {
        this.setSession(this.token, user)
      }
    },
  },
})
