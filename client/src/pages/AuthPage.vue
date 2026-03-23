<template>
  <section class="mx-auto max-w-md">
    <div class="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h2 class="mb-1 text-2xl font-bold text-slate-800">Welcome</h2>
      <p class="mb-6 text-sm text-slate-500">Sign in or create an account to continue.</p>

      <div class="mb-4 flex gap-2">
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="mode === 'signin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="mode = 'signin'"
        >
          Sign In
        </button>
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="mode = 'register'"
        >
          Register
        </button>
      </div>

      <form class="space-y-3" @submit.prevent="handleSubmit">
        <input
          v-model="email"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="email"
          placeholder="Email"
        />
        <input
          v-model="password"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="password"
          placeholder="Password"
        />

        <p class="text-xs text-slate-500">
          CEO account: <span class="font-medium">ceo@gmail.com</span> / <span class="font-medium">test123</span>
        </p>
        <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>

        <button
          type="submit"
          class="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500"
        >
          {{ mode === 'signin' ? 'Sign In' : 'Create Account' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const mode = ref<'signin' | 'register'>('signin')
const email = ref('')
const password = ref('')
const error = ref('')

async function handleSubmit(): Promise<void> {
  error.value = ''
  try {
    if (mode.value === 'signin') {
      await auth.signIn(email.value, password.value)
    } else {
      await auth.signUp(email.value, password.value)
    }
    await router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed'
  }
}
</script>
