<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import DocumentFilters from '../components/documents/DocumentFilters.vue'
import DocumentList from '../components/documents/DocumentList.vue'
import { useDocumentStore } from '../stores/documentStore'

const documentStore = useDocumentStore()
const { filters, filteredDocuments, loading } = storeToRefs(documentStore)

onMounted(() => {
  void documentStore.fetchDocuments()
})
</script>

<template>
  <div>
    <AppHeader />
    <div class="flex min-h-[calc(100vh-64px)]">
      <AppSidebar />
      <main class="flex-1 space-y-4 p-6">
        <h2 class="text-lg font-semibold">Documents</h2>
        <DocumentFilters v-model="filters" />
        <p v-if="loading">Loading documents...</p>
        <DocumentList v-else :documents="filteredDocuments" />
      </main>
    </div>
  </div>
</template>
