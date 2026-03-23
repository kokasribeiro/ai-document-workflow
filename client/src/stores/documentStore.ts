import { defineStore } from 'pinia'
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from '../services/documentService'
import type { DocumentItem, DocumentStatus } from '../types/document'

type CreatePayload = Omit<DocumentItem, 'id'>

export const useDocumentStore = defineStore('documents', {
  state: () => ({
    items: [] as DocumentItem[],
    loading: false,
    error: '',
    search: '',
    statusFilter: '' as '' | DocumentStatus,
    categoryFilter: '',
  }),

  getters: {
    filteredDocuments(state) {
      return state.items.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(state.search.toLowerCase())
        const matchesStatus = state.statusFilter ? doc.status === state.statusFilter : true
        const matchesCategory = state.categoryFilter ? doc.category === state.categoryFilter : true
        return matchesSearch && matchesStatus && matchesCategory
      })
    },
  },

  actions: {
    async fetchDocuments() {
      this.loading = true
      this.error = ''
      try {
        this.items = await getDocuments()
      } catch {
        this.error = 'Could not load documents'
      } finally {
        this.loading = false
      }
    },

    async addDocument(payload: CreatePayload) {
      const created = await createDocument(payload)
      this.items.unshift(created)
    },

    async editDocument(id: string, payload: Partial<CreatePayload>) {
      const updated = await updateDocument(id, payload)
      const idx = this.items.findIndex((item) => item.id === id)
      if (idx >= 0) {
        this.items[idx] = updated
      } else {
        this.items.unshift(updated)
      }
    },

    async removeDocument(id: string) {
      await deleteDocument(id)
      this.items = this.items.filter((item) => item.id !== id)
    },
  },
})
