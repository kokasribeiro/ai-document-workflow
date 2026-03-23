<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight text-slate-800">Documents</h2>
      <RouterLink
        to="/documents/new"
        class="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500"
      >
        New Document
      </RouterLink>
    </div>

    <DocumentFilters />
    <DocumentList />
  </section>
</template>

<script setup lang="ts">
import DocumentFilters from '../components/documents/DocumentFilters.vue'
import DocumentList from '../components/documents/DocumentList.vue'
</script>
