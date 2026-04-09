<template>
  <div class="mb-4 grid gap-3 rounded-xl border border-slate-200/70 bg-white/90 p-3 shadow-sm md:rounded-2xl md:p-4 md:grid-cols-3">
    <input
      v-model="store.search"
      class="rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      type="text"
      placeholder="Search by title"
    />

    <DocumentStatusSelect v-model="store.statusFilter" :include-empty="true" empty-label="All Status" />
    <CategorySelect v-model="store.categoryFilter" :include-empty="true" />
  </div>
</template>

<script setup lang="ts">
import { useDocumentStore } from '../../stores/documentStore'
import CategorySelect from './CategorySelect.vue'
import DocumentStatusSelect from './DocumentStatusSelect.vue'

const store = useDocumentStore()
</script>
