<template>
  <section>
    <div class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">Documents</h2>
      <RouterLink
        to="/documents/new"
        class="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-center font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 sm:w-auto"
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
