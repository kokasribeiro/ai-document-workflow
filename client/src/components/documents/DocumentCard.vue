<script setup lang="ts">
import type { DocumentItem } from '../../types/document'
import StatusBadge from './StatusBadge.vue'

defineProps<{ document: DocumentItem }>()
</script>

<template>
  <article class="rounded border border-slate-200 p-4">
    <h3 class="font-medium">{{ document.title }}</h3>
    <p class="text-sm text-slate-600">{{ document.category }}</p>
    <StatusBadge :status="document.status" />
  </article>
</template>
