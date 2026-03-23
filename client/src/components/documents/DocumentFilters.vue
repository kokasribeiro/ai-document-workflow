<script setup lang="ts">
import type { DocumentFilters } from '../../types/document'

const model = defineModel<DocumentFilters>({ required: true })
</script>

<template>
  <section class="flex gap-3">
    <input
      v-model="model.query"
      type="text"
      placeholder="Search documents"
      class="rounded border border-slate-300 px-3 py-2"
    />
    <select v-model="model.status" class="rounded border border-slate-300 px-3 py-2">
      <option value="all">All status</option>
      <option value="draft">Draft</option>
      <option value="processing">Processing</option>
      <option value="completed">Completed</option>
      <option value="error">Error</option>
    </select>
    <input
      v-model="model.category"
      type="text"
      placeholder="Category or all"
      class="rounded border border-slate-300 px-3 py-2"
    />
  </section>
</template>
