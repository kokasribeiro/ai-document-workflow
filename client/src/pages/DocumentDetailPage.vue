<template>
  <section>
    <h2 class="mb-6 text-2xl font-semibold">Document Detail</h2>
    <p v-if="loading" class="text-sm text-slate-500">Loading document...</p>
    <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>
    <div v-else-if="document" class="space-y-4 rounded-xl bg-white p-6 shadow">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-xl font-semibold">{{ document.title }}</h3>
          <p class="text-sm text-slate-500">{{ document.category }}</p>
        </div>
        <StatusBadge :status="document.status" />
      </div>

      <p class="text-slate-700">{{ document.description }}</p>

      <div class="grid gap-2 text-sm text-slate-500">
        <p>Created: {{ document.createdAt }}</p>
        <p>Updated: {{ document.updatedAt }}</p>
        <p v-if="document.aiSuggestedCategory">
          AI Category: {{ document.aiSuggestedCategory }}
        </p>
      </div>

      <div v-if="document.aiSummary" class="rounded-lg bg-slate-50 p-4">
        <p class="text-xs font-semibold text-slate-500">AI Summary</p>
        <p class="mt-1 text-sm text-slate-700">{{ document.aiSummary }}</p>
      </div>

      <div class="flex flex-wrap gap-3">
        <select
          v-model="nextStatus"
          class="rounded border px-3 py-2 text-sm"
          @change="handleStatusChange"
        >
          <option value="Draft">Draft</option>
          <option value="Review">Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button type="button" class="rounded border px-4 py-2" @click="toggleEdit">
          {{ isEditing ? 'Cancel Edit' : 'Edit' }}
        </button>
        <button type="button" class="rounded border border-rose-300 px-4 py-2 text-rose-700" @click="handleDelete">
          Delete
        </button>
      </div>

      <form
        v-if="isEditing"
        class="grid gap-3 rounded-lg border p-4"
        @submit.prevent="handleSave"
      >
        <input v-model="form.title" class="rounded border px-3 py-2" type="text" />
        <textarea v-model="form.description" class="rounded border px-3 py-2" rows="5" />
        <select v-model="form.category" class="rounded border px-3 py-2">
          <option value="Invoice">Invoice</option>
          <option value="Contract">Contract</option>
          <option value="Report">Report</option>
          <option value="HR">HR</option>
        </select>
        <button type="submit" class="w-fit rounded bg-slate-900 px-4 py-2 text-white">
          Save Changes
        </button>
      </form>
    </div>
    <p v-else class="text-sm text-slate-500">Document not found.</p>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/documentStore'
import { getDocumentById } from '../services/documentService'
import type { DocumentItem, DocumentStatus } from '../types/document'
import StatusBadge from '../components/documents/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const store = useDocumentStore()

const loading = ref(true)
const error = ref('')
const document = ref<DocumentItem | null>(null)
const isEditing = ref(false)
const nextStatus = ref<DocumentStatus>('Draft')
const form = reactive({
  title: '',
  description: '',
  category: 'Invoice',
})

function syncForm(doc: DocumentItem): void {
  form.title = doc.title
  form.description = doc.description
  form.category = doc.category
  nextStatus.value = doc.status
}

async function loadDocument(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const id = String(route.params.id ?? '')
    const found = await getDocumentById(id)
    document.value = found
    syncForm(found)
  } catch {
    error.value = 'Could not load document'
    document.value = null
  } finally {
    loading.value = false
  }
}

function toggleEdit(): void {
  isEditing.value = !isEditing.value
  if (isEditing.value && document.value) syncForm(document.value)
}

async function handleSave(): Promise<void> {
  if (!document.value) return
  await store.editDocument(document.value.id, {
    title: form.title,
    description: form.description,
    category: form.category,
    updatedAt: new Date().toISOString(),
  })
  await loadDocument()
  isEditing.value = false
}

async function handleDelete(): Promise<void> {
  if (!document.value) return
  const confirmed = window.confirm('Delete this document?')
  if (!confirmed) return
  await store.removeDocument(document.value.id)
  await router.push('/documents')
}

async function handleStatusChange(): Promise<void> {
  if (!document.value) return
  await store.editDocument(document.value.id, {
    status: nextStatus.value,
    updatedAt: new Date().toISOString(),
  })
  await loadDocument()
}

void loadDocument()
</script>
