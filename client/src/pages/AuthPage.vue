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
          v-if="mode === 'register'"
          v-model="username"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="text"
          placeholder="Username"
        />
        <input
          v-if="mode === 'register'"
          v-model="birthDate"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="date"
          placeholder="Date of birth"
        />
        <input
          v-model="password"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="password"
          placeholder="Password"
        />
        <input
          v-if="mode === 'register'"
          v-model="confirmPassword"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="password"
          placeholder="Repeat password"
        />
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
const username = ref('')
const birthDate = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

async function handleSubmit(): Promise<void> {
  error.value = ''
  try {
    if (mode.value === 'signin') {
      await auth.signIn(email.value, password.value)
    } else {
      const now = new Date()
      const birth = new Date(birthDate.value)
      let age = now.getFullYear() - birth.getFullYear()
      const monthDiff = now.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--
      if (!birthDate.value || Number.isNaN(birth.getTime()) || age < 18) {
        throw new Error('You must be at least 18 years old')
      }
      if (password.value !== confirmPassword.value) {
        throw new Error('Passwords do not match')
      }
      await auth.signUp({
        email: email.value,
        username: username.value,
        birthDate: birthDate.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      })
    }
    await router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed'
  }
}
</script>
