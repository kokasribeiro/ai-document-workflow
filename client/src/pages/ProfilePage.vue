<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-slate-800">My Profile</h2>
    <section class="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:max-w-2xl">
      <template v-if="!isEditing">
        <p class="text-sm text-slate-500">Email</p>
        <p class="rounded-lg bg-slate-50 px-3 py-2 text-slate-800">{{ profile.email || '-' }}</p>
        <p class="text-sm text-slate-500">Username</p>
        <p class="rounded-lg bg-slate-50 px-3 py-2 text-slate-800">{{ profile.username || '-' }}</p>
        <p class="text-sm text-slate-500">Name</p>
        <p class="rounded-lg bg-slate-50 px-3 py-2 text-slate-800">{{ profile.name || '-' }}</p>
        <p class="text-sm text-slate-500">Address</p>
        <p class="rounded-lg bg-slate-50 px-3 py-2 text-slate-800">{{ profile.address || '-' }}</p>
        <p class="text-sm text-slate-500">Phone</p>
        <p class="rounded-lg bg-slate-50 px-3 py-2 text-slate-800">{{ profile.phone || '-' }}</p>
        <button
          type="button"
          class="w-fit rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500"
          @click="startEdit"
        >
          Edit
        </button>
      </template>

      <form v-else class="grid gap-3" @submit.prevent="handleSave">
        <template v-if="auth.user?.role === 'CEO'">
          <input
            v-model="form.email"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="email"
            placeholder="Email"
          />
          <input
            v-model="form.address"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="text"
            placeholder="Address"
          />
          <input
            v-model="form.phone"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="text"
            placeholder="Phone"
          />
        </template>
        <template v-else>
          <input
            v-model="form.email"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="email"
            placeholder="Email"
          />
          <input
            v-model="form.username"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="text"
            placeholder="Username"
          />
          <input
            v-model="form.address"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="text"
            placeholder="Address"
          />
          <input
            v-model="form.phone"
            class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            type="text"
            placeholder="Phone"
          />
        </template>
        <input
          v-if="auth.user?.role === 'CEO'"
          v-model="form.name"
          class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="text"
          placeholder="Name"
        />
        <div class="flex gap-2">
          <button
            :disabled="saving"
            type="submit"
            class="w-fit rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ saving ? 'Saving...' : 'Save Profile' }}
          </button>
          <button
            type="button"
            class="w-fit rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>

      <p v-if="message" class="text-sm text-emerald-600">{{ message }}</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
    </section>

    <section class="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:max-w-2xl">
      <h3 class="text-lg font-semibold text-slate-800">Change Password</h3>
      <input
        v-model="passwordForm.oldPassword"
        class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        type="password"
        placeholder="Current password"
      />
      <button
        v-if="!canSetNewPassword"
        :disabled="verifyingPassword"
        type="button"
        class="w-fit rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleVerifyPassword"
      >
        {{ verifyingPassword ? 'Checking...' : 'Verify current password' }}
      </button>

      <template v-if="canSetNewPassword">
        <input
          v-model="passwordForm.newPassword"
          class="rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          type="password"
          placeholder="New password"
        />
        <button
          :disabled="changingPassword"
          type="button"
          class="w-fit rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          @click="handleChangePassword"
        >
          {{ changingPassword ? 'Updating...' : 'Save new password' }}
        </button>
      </template>

      <p v-if="passwordMessage" class="text-sm text-emerald-600">{{ passwordMessage }}</p>
      <p v-if="passwordError" class="text-sm text-rose-600">{{ passwordError }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { changePassword, verifyCurrentPassword } from '../services/authService'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const saving = ref(false)
const isEditing = ref(false)
const error = ref('')
const message = ref('')
const verifyingPassword = ref(false)
const changingPassword = ref(false)
const canSetNewPassword = ref(false)
const passwordError = ref('')
const passwordMessage = ref('')

const profile = reactive({
  email: auth.user?.email ?? '',
  username: auth.user?.username ?? '',
  name: auth.user?.name ?? '',
  address: auth.user?.address ?? '',
  phone: auth.user?.phone ?? '',
})

const form = reactive({
  email: '',
  username: '',
  name: '',
  address: '',
  phone: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
})

function syncFormFromProfile(): void {
  form.email = profile.email
  form.username = profile.username
  form.name = profile.name
  form.address = profile.address
  form.phone = profile.phone
}

function startEdit(): void {
  error.value = ''
  message.value = ''
  syncFormFromProfile()
  isEditing.value = true
}

function cancelEdit(): void {
  error.value = ''
  message.value = ''
  isEditing.value = false
}

onMounted(async () => {
  try {
    const user = await auth.refreshProfile()
    profile.email = user.email
    profile.username = user.username
    profile.name = user.name
    profile.address = user.address
    profile.phone = user.phone
  } catch {
    // Keep local store values if request fails
  }
})

async function handleSave(): Promise<void> {
  saving.value = true
  error.value = ''
  message.value = ''
  try {
    const user = await auth.saveProfile({
      email: form.email.trim(),
      username: auth.user?.role === 'USER' ? form.username.trim() : undefined,
      name: auth.user?.role === 'CEO' ? form.name.trim() : undefined,
      address: form.address.trim(),
      phone: form.phone.trim(),
    })
    profile.email = user.email
    profile.username = user.username
    profile.name = user.name
    profile.address = user.address
    profile.phone = user.phone
    isEditing.value = false
    message.value = 'Profile updated successfully'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not update profile'
  } finally {
    saving.value = false
  }
}

async function handleVerifyPassword(): Promise<void> {
  verifyingPassword.value = true
  passwordError.value = ''
  passwordMessage.value = ''
  canSetNewPassword.value = false
  try {
    await verifyCurrentPassword(passwordForm.oldPassword)
    canSetNewPassword.value = true
    passwordMessage.value = 'Current password is correct. You can set a new password now.'
  } catch (e) {
    passwordError.value = e instanceof Error ? e.message : 'Could not verify password'
  } finally {
    verifyingPassword.value = false
  }
}

async function handleChangePassword(): Promise<void> {
  changingPassword.value = true
  passwordError.value = ''
  passwordMessage.value = ''
  try {
    await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    passwordMessage.value = 'Password updated successfully'
    canSetNewPassword.value = false
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
  } catch (e) {
    passwordError.value = e instanceof Error ? e.message : 'Could not change password'
  } finally {
    changingPassword.value = false
  }
}
</script>
