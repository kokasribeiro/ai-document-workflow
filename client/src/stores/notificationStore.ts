import { defineStore } from 'pinia'
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead as markAllAsReadApi,
  markAsRead as markAsReadApi,
  type Notification,
} from '../services/notificationService'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    items: [] as Notification[],
    unreadCount: 0,
    polling: null as ReturnType<typeof setInterval> | null,
  }),

  actions: {
    async fetch() {
      try {
        const [items, count] = await Promise.all([getNotifications(), getUnreadCount()])
        this.items = items
        this.unreadCount = count
      } catch {
        // Silently fail — header just won't update
      }
    },

    async markAsRead(id: string) {
      await markAsReadApi(id)
      const item = this.items.find((n) => n.id === id)
      if (item && !item.read) {
        item.read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    async markAllAsRead() {
      await markAllAsReadApi()
      this.items.forEach((n) => (n.read = true))
      this.unreadCount = 0
    },

    startPolling() {
      this.fetch()
      if (this.polling) return
      this.polling = setInterval(() => this.fetch(), 15_000)
    },

    stopPolling() {
      if (this.polling) {
        clearInterval(this.polling)
        this.polling = null
      }
    },
  },
})
