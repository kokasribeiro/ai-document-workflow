<template>
  <header
    class="sticky top-0 z-20 border-b border-white/30 bg-white/80 px-4 py-3 shadow-sm backdrop-blur md:px-6 md:py-4"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <!-- Mobile hamburger -->
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 md:hidden"
          @click="emit('toggle-menu')"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>
        <h1
          class="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 bg-clip-text text-lg font-extrabold text-transparent md:text-2xl"
        >
          <span class="hidden sm:inline">AI Document Workflow</span>
          <span class="sm:hidden">AI DocFlow</span>
        </h1>
      </div>

      <!-- Desktop-only actions -->
      <div class="hidden items-center gap-3 md:flex">
        <!-- Notification bell (desktop) -->
        <div v-if="auth.user" class="relative" ref="bellRef">
          <button
            type="button"
            class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            @click="bellOpen = !bellOpen"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span
              v-if="notifications.unreadCount > 0"
              class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
            >
              {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
            </span>
          </button>

          <div
            v-if="bellOpen"
            class="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p class="text-sm font-semibold text-slate-800">Notifications</p>
              <button
                v-if="notifications.unreadCount > 0"
                type="button"
                class="text-xs font-medium text-indigo-600 transition hover:text-indigo-800"
                @click="handleMarkAllRead"
              >
                Mark all read
              </button>
            </div>

            <div class="max-h-72 overflow-y-auto">
              <button
                v-for="n in notifications.items"
                :key="n.id"
                type="button"
                class="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                :class="n.read ? 'opacity-60' : ''"
                @click="handleNotificationClick(n)"
              >
                <span
                  class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                  :class="n.read ? 'bg-transparent' : 'bg-rose-500'"
                />
                <div class="min-w-0">
                  <p class="text-sm text-slate-700">{{ n.message }}</p>
                  <p class="mt-0.5 text-xs text-slate-400">{{ formatTime(n.createdAt) }}</p>
                </div>
              </button>

              <p
                v-if="notifications.items.length === 0"
                class="px-4 py-6 text-center text-sm text-slate-400"
              >
                No notifications yet
              </p>
            </div>
          </div>
        </div>

        <span
          v-if="auth.user"
          class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
        >
          {{ auth.user.username || auth.user.email }} ({{ auth.user.role }})
        </span>
        <button
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <!-- Mobile: just notification dot indicator -->
      <button
        v-if="auth.user && notifications.unreadCount > 0"
        type="button"
        class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
        @click="emit('toggle-menu')"
      >
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        <span class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import type { Notification } from '../../services/notificationService'

const emit = defineEmits<{ 'toggle-menu': [] }>()

const router = useRouter()
const auth = useAuthStore()
const notifications = useNotificationStore()

const bellOpen = ref(false)
const bellRef = ref<HTMLElement | null>(null)

watch(
  () => auth.isAuthenticated,
  (loggedIn) => {
    if (loggedIn) notifications.startPolling()
    else notifications.stopPolling()
  },
  { immediate: true },
)

function handleOutsideClick(e: MouseEvent) {
  if (bellRef.value && !bellRef.value.contains(e.target as Node)) {
    bellOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick, true))
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick, true)
  notifications.stopPolling()
})

async function handleNotificationClick(n: Notification) {
  if (!n.read) await notifications.markAsRead(n.id)
  bellOpen.value = false
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

async function logout(): Promise<void> {
  notifications.stopPolling()
  auth.clearSession()
  await router.push('/auth')
}
</script>
