<template>
  <section>
    <h2 class="mb-6 text-3xl font-bold tracking-tight text-slate-800">Document Detail</h2>
    <p v-if="loading" class="text-sm text-slate-500">Loading document...</p>
    <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>
    <div v-else-if="document" class="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <p v-if="statusError" class="text-sm text-rose-600">{{ statusError }}</p>
      <p v-if="statusSuccess" class="text-sm text-emerald-700">{{ statusSuccess }}</p>
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

      <div v-if="document.aiSummary" class="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <p class="text-xs font-semibold text-slate-500">AI Summary</p>
        <p class="mt-1 text-sm text-slate-700">{{ document.aiSummary }}</p>
      </div>

      <div class="flex flex-wrap gap-3">
        <select
          v-model="nextStatus"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="Draft">Draft</option>
          <option value="Review">Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          type="button"
          class="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="nextStatus === document.status"
          @click="handleStatusSave"
        >
          Save Changes
        </button>

        <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100" @click="toggleEdit">
          {{ isEditing ? 'Cancel Edit' : 'Edit' }}
        </button>
        <button type="button" class="rounded-lg border border-rose-300 px-4 py-2 font-medium text-rose-700 transition hover:bg-rose-50" @click="handleDelete">
          Delete
        </button>
      </div>

      <form
        v-if="isEditing"
        class="grid gap-3 rounded-xl border border-slate-200 p-4"
        @submit.prevent="handleSave"
      >
        <input v-model="form.title" class="rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" type="text" />
        <textarea v-model="form.description" class="rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" rows="5" />
        <select v-model="form.category" class="rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
          <option value="Invoice">Invoice</option>
          <option value="Contract">Contract</option>
          <option value="Report">Report</option>
          <option value="HR">HR</option>
        </select>
        <button type="submit" class="w-fit rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500">
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
const statusError = ref('')
const statusSuccess = ref('')
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

async function handleStatusSave(): Promise<void> {
  if (!document.value) return
  if (nextStatus.value === document.value.status) return
  statusError.value = ''
  statusSuccess.value = ''
  try {
    await store.editDocument(document.value.id, {
      status: nextStatus.value,
      updatedAt: new Date().toISOString(),
    })
    await loadDocument()
    statusSuccess.value = `Status updated to ${nextStatus.value}.`
  } catch (e) {
    statusError.value =
      e instanceof Error ? e.message : 'Failed to update document status'
  }
}

void loadDocument()
</script>
