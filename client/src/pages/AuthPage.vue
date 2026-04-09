<template>
  <section class="mx-auto w-full max-w-md">
    <div class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="mb-1 text-xl font-bold text-slate-800 sm:text-2xl">Welcome</h2>
      <p class="mb-5 text-sm text-slate-500 sm:mb-6">Sign in or create an account to continue.</p>

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
        <PasswordInput
          v-model="password"
          placeholder="Password"
          :autocomplete="mode === 'signin' ? 'current-password' : 'new-password'"
        />
        <PasswordInput
          v-if="mode === 'register'"
          v-model="confirmPassword"
          placeholder="Repeat password"
          autocomplete="new-password"
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
import PasswordInput from '../components/PasswordInput.vue'
import { useAuthStore } from '../stores/authStore'
import { isAtLeastAge } from '../utils/age'

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
      if (!birthDate.value || !isAtLeastAge(birthDate.value, 18)) {
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
