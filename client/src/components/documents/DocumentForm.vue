<template>
  <form class="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
    <div>
      <label class="mb-1 block text-sm font-medium">Title</label>
      <input v-model="title" class="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" type="text" />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Description</label>
      <textarea v-model="description" class="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" rows="6" />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Upload Document (PDF only)</label>
      <input
        type="file"
        accept=".pdf,application/pdf"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-slate-700 hover:file:bg-slate-200"
        @change="handleFileUpload"
      />
      <p v-if="fileName" class="mt-1 text-xs text-slate-500">Uploaded: {{ fileName }}</p>
      <p v-if="fileError" class="mt-1 text-xs text-rose-600">{{ fileError }}</p>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Category</label>
      <CategorySelect v-model="category" />
    </div>

    <div class="flex flex-wrap gap-3">
      <button type="submit" class="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500">
        Save Document
      </button>

      <button
        type="button"
        class="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 font-medium text-emerald-700 transition hover:bg-emerald-100"
        @click="fillFakeDocument"
      >
        Create Fake Document
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="aiLoading"
        @click="handleAiSummary"
      >
        Generate AI Summary
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="aiLoading"
        @click="handleAiCategory"
      >
        Suggest Category
      </button>
    </div>

    <div v-if="aiLoading" class="flex items-center gap-2 text-sm text-slate-500">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span>AI is processing...</span>
    </div>
    <p v-if="aiError" class="text-sm text-rose-600">{{ aiError }}</p>
    <p v-if="submitError" class="text-sm text-rose-600">{{ submitError }}</p>

    <div v-if="aiSummary" class="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
      <p class="text-xs font-semibold text-slate-500">AI Summary</p>
      <p class="mt-2 text-sm text-slate-700">{{ aiSummary }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DEFAULT_DOCUMENT_CATEGORY, DOCUMENT_CATEGORIES } from '../../constants/documents'
import { useDocumentStore } from '../../stores/documentStore'
import { summarizeDocument, suggestCategory } from '../../services/aiService'
import { extractPdfText } from '../../utils/pdfText'
import CategorySelect from './CategorySelect.vue'

const router = useRouter()
const store = useDocumentStore()

const title = ref('')
const description = ref('')
const category = ref<string>(DEFAULT_DOCUMENT_CATEGORY)
const aiSummary = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const submitError = ref('')
const fileName = ref('')
const fileError = ref('')

async function runAiOp<T>(
  operation: () => Promise<T>,
  onSuccess: (value: T) => void,
  fallbackMessage: string,
): Promise<void> {
  aiLoading.value = true
  aiError.value = ''
  try {
    onSuccess(await operation())
  } catch (error) {
    aiError.value = error instanceof Error ? error.message : fallbackMessage
  } finally {
    aiLoading.value = false
  }
}

async function handleAiSummary(): Promise<void> {
  await runAiOp(
    () => summarizeDocument(description.value),
    (summary) => {
      aiSummary.value = summary
    },
    'Failed to generate summary',
  )
}

async function handleAiCategory(): Promise<void> {
  await runAiOp(
    () => suggestCategory(description.value),
    (suggested) => {
      category.value = suggested
    },
    'Failed to suggest category',
  )
}

async function handleSubmit(): Promise<void> {
  submitError.value = ''
  try {
    await store.addDocument({
      title: title.value,
      description: description.value,
      category: category.value,
      status: 'Draft',
      aiSummary: aiSummary.value,
      aiSuggestedCategory: category.value,
    })
    await router.push('/documents')
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Failed to save document'
  }
}

async function handleFileUpload(event: Event): Promise<void> {
  fileError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    if (file.type && file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed')
    }
    const text = (await extractPdfText(file)).trim()
    if (!text) {
      throw new Error('Could not extract text from PDF')
    }
    description.value = text
    fileName.value = file.name
    if (!title.value.trim()) {
      title.value = file.name.replace(/\.[^.]+$/, '')
    }
  } catch (error) {
    fileError.value = error instanceof Error ? error.message : 'Could not process file'
  } finally {
    input.value = ''
  }
}
</script>
