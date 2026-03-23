export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

function getToken(): string {
  return localStorage.getItem('auth_token') ?? ''
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {})
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const fallback = `Request failed: ${response.status}`
  const isPublicAuthRoute = path === '/auth/login' || path === '/auth/register'
  if (!response.ok) {
    if (response.status === 401 && !isPublicAuthRoute) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/auth'
      throw new Error('Session expired. Please sign in again.')
    }
    let message = fallback
    try {
      const data = (await response.json()) as { error?: string }
      if (typeof data.error === 'string' && data.error.trim()) {
        message = data.error
      }
    } catch {
      // Keep fallback when response has no JSON body
    }
    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
