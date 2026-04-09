import { apiRequest } from './api'

export interface Notification {
  id: string
  userId: string
  message: string
  documentId: string | null
  read: boolean
  createdAt: string
}

export async function getNotifications(): Promise<Notification[]> {
  return apiRequest<Notification[]>('/notifications')
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiRequest<{ count: number }>('/notifications/unread-count')
  return data.count
}

export async function markAsRead(id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/notifications/${id}/read`, { method: 'PUT' })
}

export async function markAllAsRead(): Promise<void> {
  await apiRequest<{ ok: boolean }>('/notifications/read-all', { method: 'PUT' })
}
