<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="w-64 border-r border-slate-200 p-4">
    <nav class="flex flex-col gap-2">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/documents">Documents</RouterLink>
      <RouterLink to="/documents/new">New Document</RouterLink>
    </nav>
  </aside>
</template>
