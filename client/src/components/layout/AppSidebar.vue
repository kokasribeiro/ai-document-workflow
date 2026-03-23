<template>
  <aside
    class="hidden w-72 border-r border-indigo-200/50 bg-gradient-to-b from-indigo-100/80 via-violet-100/80 to-fuchsia-100/80 p-4 backdrop-blur md:block"
  >
    <nav class="space-y-3">
      <RouterLink
        :class="navClass('dashboard')"
        to="/"
      >
        <span class="text-base">📊</span>
        <span>Dashboard</span>
      </RouterLink>
      <RouterLink
        :class="navClass('documents')"
        to="/documents"
      >
        <span class="text-base">📄</span>
        <span>Documents</span>
      </RouterLink>
      <RouterLink
        :class="navClass('new-document')"
        to="/documents/new"
      >
        <span class="text-base">✨</span>
        <span>New Document</span>
      </RouterLink>
      <RouterLink
        :class="navClass('profile')"
        to="/profile"
      >
        <span class="text-base">👤</span>
        <span>My Profile</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

function navClass(name: string): string {
  const base =
    'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200'

  if (route.name === name) {
    return `${base} border-indigo-300 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md`
  }

  if (name === 'dashboard') {
    return `${base} border-indigo-100 bg-indigo-50/70 text-indigo-700 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-100`
  }
  if (name === 'documents') {
    return `${base} border-emerald-100 bg-emerald-50/70 text-emerald-700 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-100`
  }
  if (name === 'new-document') {
    return `${base} border-amber-100 bg-amber-50/70 text-amber-700 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-100`
  }
  return `${base} border-purple-100 bg-purple-50/70 text-purple-700 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-100`
}
</script>
