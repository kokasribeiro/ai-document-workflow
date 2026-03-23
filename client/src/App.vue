<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 text-slate-900"
  >
    <template v-if="route.name !== 'auth'">
      <AppHeader />
      <div class="flex">
        <AppSidebar />
        <main class="flex-1 p-6 md:p-8">
          <RouterView />
        </main>
      </div>
    </template>
    <div v-else class="p-6 md:p-8">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const route = useRoute()
</script>
