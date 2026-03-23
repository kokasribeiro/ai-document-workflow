<template>
  <header
    class="sticky top-0 z-20 border-b border-white/30 bg-white/80 px-6 py-4 shadow-sm backdrop-blur"
  >
    <div class="flex items-center justify-between">
      <h1
        class="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 bg-clip-text text-2xl font-extrabold text-transparent"
      >
        AI Document Workflow System
      </h1>
      <div class="flex items-center gap-3">
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
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

async function logout(): Promise<void> {
  auth.clearSession()
  await router.push('/auth')
}
</script>
