<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold">Documents</h2>
      <RouterLink
        to="/documents/new"
        class="rounded bg-slate-900 px-4 py-2 text-white"
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
