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
import { useDocumentStore } from '../../stores/documentStore'
import { summarizeDocument, suggestCategory } from '../../services/aiService'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

const router = useRouter()
const store = useDocumentStore()

const title = ref('')
const description = ref('')
const category = ref('Invoice')
const aiSummary = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const submitError = ref('')
const fileName = ref('')
const fileError = ref('')

async function handleAiSummary() {
  aiLoading.value = true
  aiError.value = ''
  try {
    aiSummary.value = await summarizeDocument(description.value)
  } catch (error) {
    aiError.value = error instanceof Error ? error.message : 'Failed to generate summary'
  } finally {
    aiLoading.value = false
  }
}

async function handleAiCategory() {
  aiLoading.value = true
  aiError.value = ''
  try {
    category.value = await suggestCategory(description.value)
  } catch (error) {
    aiError.value = error instanceof Error ? error.message : 'Failed to suggest category'
  } finally {
    aiLoading.value = false
  }
}

async function handleSubmit() {
  submitError.value = ''
  try {
    await store.addDocument({
      title: title.value,
      description: description.value,
      category: category.value,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiSummary: aiSummary.value,
      aiSuggestedCategory: category.value,
    })
    router.push('/documents')
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Failed to save document'
  }
}

async function extractPdfText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const task = pdfjsLib.getDocument({ data: bytes })
  const pdf = await task.promise
  const pages: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const textItems = textContent.items
      .map((item) => item as { str?: string; transform?: number[] })
      .filter((item) => typeof item.str === 'string' && Array.isArray(item.transform)) as Array<{
      str: string
      transform: number[]
    }>

    // Rebuild line order by Y coordinate and then by X coordinate.
    const rows = new Map<number, Array<{ x: number; text: string }>>()
    for (const item of textItems) {
      const transform = item.transform
      if (!transform || transform.length < 6) continue
      const yRaw = transform[5]
      const xRaw = transform[4]
      if (typeof yRaw !== 'number' || typeof xRaw !== 'number') continue
      const y = Math.round(yRaw * 10) / 10
      const x = xRaw
      const bucket = rows.get(y) ?? []
      bucket.push({ x, text: item.str })
      rows.set(y, bucket)
    }

    const sortedY = [...rows.keys()].sort((a, b) => b - a)
    const lines = sortedY.map((y) => {
      const parts = (rows.get(y) ?? []).sort((a, b) => a.x - b.x)
      return parts
        .map((p) => p.text.trim())
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    })

    const cleanLines = lines.filter((line) => {
      if (!line) return false
      const hasLetters = /[A-Za-zÀ-ÿ]/.test(line)
      if (!hasLetters) return false
      const symbolDensity = (line.match(/[$_=|{}[\]<>]/g)?.length ?? 0) / line.length
      if (symbolDensity > 0.15) return false
      const longTokenNoise = line
        .split(/\s+/)
        .some((token) => token.length > 25 && !/[aeiouà-ÿ]/i.test(token))
      if (longTokenNoise) return false
      return true
    })

    const pageText = cleanLines.join('\n').trim()
    if (pageText) pages.push(pageText)
  }

  return pages.join('\n\n')
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
