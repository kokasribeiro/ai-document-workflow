export const API_BASE_URL = 'http://localhost:3001'

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
  if (!response.ok) {
    try {
      const data = (await response.json()) as { error?: string }
      throw new Error(data.error || fallback)
    } catch {
      throw new Error(fallback)
    }
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
