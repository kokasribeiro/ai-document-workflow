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
      <label class="mb-1 block text-sm font-medium">Category</label>
      <select v-model="category" class="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
        <option value="Invoice">Invoice</option>
        <option value="Contract">Contract</option>
        <option value="Report">Report</option>
        <option value="HR">HR</option>
      </select>
    </div>

    <div class="flex flex-wrap gap-3">
      <button type="submit" class="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500">
        Save Document
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
        @click="handleAiSummary"
      >
        Generate AI Summary
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
        @click="handleAiCategory"
      >
        Suggest Category
      </button>
    </div>

    <p v-if="aiLoading" class="text-sm text-slate-500">AI is processing...</p>
    <p v-if="aiError" class="text-sm text-rose-600">{{ aiError }}</p>

    <div v-if="aiSummary" class="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
      <p class="text-xs font-semibold text-slate-500">AI Summary</p>
      <p class="mt-2 text-sm text-slate-700">{{ aiSummary }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '../../stores/documentStore'
import { summarizeDocument, suggestCategory } from '../../services/aiService'

const router = useRouter()
const store = useDocumentStore()

const title = ref('')
const description = ref('')
const category = ref('Invoice')
const aiSummary = ref('')
const aiLoading = ref(false)
const aiError = ref('')

async function handleAiSummary() {
  aiLoading.value = true
  aiError.value = ''
  try {
    aiSummary.value = await summarizeDocument(description.value)
  } catch {
    aiError.value = 'Failed to generate summary'
  } finally {
    aiLoading.value = false
  }
}

async function handleAiCategory() {
  aiLoading.value = true
  aiError.value = ''
  try {
    category.value = await suggestCategory(description.value)
  } catch {
    aiError.value = 'Failed to suggest category'
  } finally {
    aiLoading.value = false
  }
}

async function handleSubmit() {
  await store.addDocument({
    title: title.value,
    description: description.value,
    category: category.value,
    status: 'Draft',
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    aiSummary: aiSummary.value,
    aiSuggestedCategory: category.value,
  })

  router.push('/documents')
}
</script>
