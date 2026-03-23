<template>
  <div
    class="flex min-h-screen flex-col bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-cyan-100 text-slate-900"
  >
    <template v-if="route.name !== 'auth'">
      <AppHeader />
      <div class="flex flex-1">
        <AppSidebar />
        <main class="flex-1 bg-white/20 p-6 backdrop-blur-[2px] md:p-8">
          <RouterView />
        </main>
      </div>
    </template>
    <div v-else class="flex-1 bg-white/20 p-6 backdrop-blur-[2px] md:p-8">
      <RouterView />
    </div>
    <footer
      class="border-t border-white/40 bg-white/40 px-6 py-3 text-center text-xs font-medium text-slate-700 backdrop-blur"
    >
      Copyright {{ currentYear }} Nelson Ribeiro. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const route = useRoute()
const currentYear = computed(() => new Date().getFullYear())
</script>
