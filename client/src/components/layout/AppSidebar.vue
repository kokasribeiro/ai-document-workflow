<template>
  <!-- Desktop sidebar -->
  <aside
    class="hidden w-72 border-r border-indigo-200/50 bg-gradient-to-b from-indigo-100/80 via-violet-100/80 to-fuchsia-100/80 p-4 backdrop-blur md:block"
  >
    <nav class="space-y-3">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :class="navClass(item)"
        :to="item.to"
      >
        <span class="text-base">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>

  <!-- Mobile drawer overlay -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-40 md:hidden">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />
        <aside
          class="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-gradient-to-b from-indigo-50 via-violet-50 to-fuchsia-50 shadow-2xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-indigo-100/60 px-4 py-3">
            <p class="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-sm font-extrabold text-transparent">
              AI DocFlow
            </p>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/60 hover:text-slate-600"
              @click="emit('close')"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- User info -->
          <div v-if="auth.user" class="border-b border-indigo-100/60 px-4 py-3">
            <p class="text-sm font-semibold text-slate-800">{{ auth.user.username || auth.user.email }}</p>
            <p class="text-xs text-slate-500">{{ auth.user.email }}</p>
            <span class="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              {{ auth.user.role }}
            </span>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-2 overflow-y-auto p-4">
            <p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</p>
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :class="navClass(item)"
              :to="item.to"
              @click="emit('close')"
            >
              <span class="text-base">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </RouterLink>

            <!-- Notifications section -->
            <div v-if="auth.user" class="mt-4">
              <div class="mb-1 flex items-center justify-between">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notifications</p>
                <button
                  v-if="notifications.unreadCount > 0"
                  type="button"
                  class="text-[10px] font-medium text-indigo-600"
                  @click="handleMarkAllRead"
                >
                  Mark all read
                </button>
              </div>

              <div v-if="notifications.items.length" class="space-y-1">
                <button
                  v-for="n in notifications.items.slice(0, 8)"
                  :key="n.id"
                  type="button"
                  class="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/70"
                  :class="n.read ? 'opacity-50' : ''"
                  @click="handleNotificationClick(n)"
                >
                  <span
                    class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                    :class="n.read ? 'bg-slate-300' : 'bg-rose-500'"
                  />
                  <div class="min-w-0">
                    <p class="text-xs leading-snug text-slate-700">{{ n.message }}</p>
                    <p class="mt-0.5 text-[10px] text-slate-400">{{ formatTime(n.createdAt) }}</p>
                  </div>
                </button>
              </div>
              <p v-else class="rounded-lg bg-white/50 px-3 py-3 text-center text-xs text-slate-400">
                No notifications
              </p>
            </div>
          </nav>

          <!-- Logout -->
          <div class="border-t border-indigo-100/60 p-4">
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
              @click="handleLogout"
            >
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
              Logout
            </button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import type { Notification } from '../../services/notificationService'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const notifications = useNotificationStore()

const navItems = [
  { name: 'dashboard', to: '/', label: 'Dashboard', icon: '📊' },
  { name: 'documents', to: '/documents', label: 'Documents', icon: '📄' },
  { name: 'new-document', to: '/documents/new', label: 'New Document', icon: '✨' },
  { name: 'profile', to: '/profile', label: 'My Profile', icon: '👤' },
] as const

const inactiveStyles: Record<(typeof navItems)[number]['name'], string> = {
  dashboard:
    'border-indigo-100 bg-indigo-50/70 text-indigo-700 hover:border-indigo-200 hover:bg-indigo-100',
  documents:
    'border-emerald-100 bg-emerald-50/70 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-100',
  'new-document':
    'border-amber-100 bg-amber-50/70 text-amber-700 hover:border-amber-200 hover:bg-amber-100',
  profile:
    'border-purple-100 bg-purple-50/70 text-purple-700 hover:border-purple-200 hover:bg-purple-100',
}

function navClass(item: (typeof navItems)[number]): string {
  const base =
    'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200'

  if (route.name === item.name) {
    return `${base} border-indigo-300 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md`
  }

  return `${base} ${inactiveStyles[item.name]}`
}

async function handleNotificationClick(n: Notification) {
  if (!n.read) await notifications.markAsRead(n.id)
  emit('close')
  if (n.documentId) await router.push(`/documents/${n.documentId}`)
}

async function handleMarkAllRead() {
  await notifications.markAllAsRead()
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

async function handleLogout() {
  emit('close')
  notifications.stopPolling()
  auth.clearSession()
  await router.push('/auth')
}
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-active aside,
.drawer-leave-active aside {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from aside,
.drawer-leave-to aside {
  transform: translateX(-100%);
}
</style>
