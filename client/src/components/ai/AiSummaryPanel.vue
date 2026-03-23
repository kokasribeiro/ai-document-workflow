<script setup lang="ts">
defineProps<{ summary: string }>()
</script>

<template>
  <section class="rounded border border-emerald-200 bg-emerald-50 p-4">
    <h3 class="mb-2 font-semibold">AI Summary</h3>
    <p class="text-sm">{{ summary }}</p>
  </section>
</template>
