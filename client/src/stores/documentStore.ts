import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { DocumentFilters, DocumentItem } from '../types/document'
import { getDocuments } from '../services/documentService'

export const useDocumentStore = defineStore('document', () => {
  const documents = ref<DocumentItem[]>([])
  const loading = ref(false)
  const filters = ref<DocumentFilters>({
    query: '',
    status: 'all',
    category: 'all',
  })

  const filteredDocuments = computed(() =>
    documents.value.filter((document) => {
      const queryOk =
        !filters.value.query ||
        document.title.toLowerCase().includes(filters.value.query.toLowerCase())
      const statusOk =
        filters.value.status === 'all' || document.status === filters.value.status
      const categoryOk =
        filters.value.category === 'all' || document.category === filters.value.category
      return queryOk && statusOk && categoryOk
    }),
  )

  async function fetchDocuments(): Promise<void> {
    loading.value = true
    try {
      documents.value = await getDocuments()
    } finally {
      loading.value = false
    }
  }

  return { documents, filteredDocuments, filters, loading, fetchDocuments }
})
