import type { UserRole } from '../auth/authStore'

export function canUserAccessDocument(
  user: { role: UserRole; email: string } | undefined,
  doc: { ownerEmail: string | null }
): boolean {
  if (!user) return false
  if (user.role === 'CEO') return true
  return doc.ownerEmail === user.email
}
