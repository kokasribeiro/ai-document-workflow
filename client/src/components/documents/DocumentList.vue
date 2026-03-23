<template>
  <div>
    <p v-if="store.loading" class="mb-4 text-sm text-slate-500">Loading documents...</p>
    <p v-if="store.error" class="mb-4 text-sm text-rose-600">{{ store.error }}</p>

    <div class="grid gap-4">
      <DocumentCard
        v-for="document in store.filteredDocuments"
        :key="document.id"
        :document="document"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDocumentStore } from '../../stores/documentStore'
import DocumentCard from './DocumentCard.vue'

const store = useDocumentStore()

onMounted(() => {
  if (!store.items.length) store.fetchDocuments()
})
</script>
