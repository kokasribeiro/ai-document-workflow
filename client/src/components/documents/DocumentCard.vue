<template>
  <article class="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold">{{ document.title }}</h3>
        <p class="text-sm text-slate-500">{{ document.category }}</p>
        <p class="mt-1 text-sm text-slate-400">Created: {{ document.createdAt }}</p>
      </div>

      <StatusBadge :status="document.status" />
    </div>

    <p class="mt-3 text-sm text-slate-600">
      {{ document.description }}
    </p>

    <div v-if="document.aiSummary" class="mt-4 rounded-lg bg-slate-50 p-3">
      <p class="text-xs font-semibold text-slate-500">AI Summary</p>
      <p class="mt-1 text-sm text-slate-700">{{ document.aiSummary }}</p>
    </div>

    <div class="mt-4">
      <RouterLink
        :to="`/documents/${document.id}`"
        class="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-100 hover:text-indigo-700"
      >
        View details
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { DocumentItem } from '../../types/document'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  document: DocumentItem
}>()
</script>
