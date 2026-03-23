<template>
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
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'dashboard', to: '/', label: 'Dashboard', icon: '📊' },
  { name: 'documents', to: '/documents', label: 'Documents', icon: '📄' },
  { name: 'new-document', to: '/documents/new', label: 'New Document', icon: '✨' },
  { name: 'profile', to: '/profile', label: 'My Profile', icon: '👤' },
] as const

const inactiveStyles: Record<(typeof navItems)[number]['name'], string> = {
  dashboard:
    'border-indigo-100 bg-indigo-50/70 text-indigo-700 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-100',
  documents:
    'border-emerald-100 bg-emerald-50/70 text-emerald-700 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-100',
  'new-document':
    'border-amber-100 bg-amber-50/70 text-amber-700 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-100',
  profile:
    'border-purple-100 bg-purple-50/70 text-purple-700 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-100',
}

function navClass(item: (typeof navItems)[number]): string {
  const base =
    'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200'

  if (route.name === item.name) {
    return `${base} border-indigo-300 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md`
  }

  return `${base} ${inactiveStyles[item.name]}`
}
</script>
