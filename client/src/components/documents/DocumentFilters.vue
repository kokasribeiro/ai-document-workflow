<template>
  <div class="mb-4 grid gap-3 rounded-xl bg-white p-4 shadow md:grid-cols-3">
    <input
      v-model="store.search"
      class="rounded border px-3 py-2"
      type="text"
      placeholder="Search by title"
    />

    <select v-model="store.statusFilter" class="rounded border px-3 py-2">
      <option value="">All statuses</option>
      <option value="Draft">Draft</option>
      <option value="Review">Review</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>

    <select v-model="store.categoryFilter" class="rounded border px-3 py-2">
      <option value="">All categories</option>
      <option value="Invoice">Invoice</option>
      <option value="Contract">Contract</option>
      <option value="Report">Report</option>
      <option value="HR">HR</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useDocumentStore } from '../../stores/documentStore'
const store = useDocumentStore()
</script>
