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
      <div v-if="open" class="fixed inset-0 z-40 md:hidden" @click.self="emit('close')">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <aside
          class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-indigo-100 via-violet-100 to-fuchsia-100 p-4 shadow-2xl"
        >
          <div class="mb-6 flex items-center justify-between">
            <p class="text-sm font-bold text-indigo-700">Menu</p>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/60"
              @click="emit('close')"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <nav class="space-y-3">
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
          </nav>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

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
