<template>
  <article class="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold">{{ document.title }}</h3>
        <p class="text-sm text-slate-500">{{ document.category }}</p>
        <p class="mt-1 text-sm text-slate-400">Created: {{ document.createdAt }}</p>
      </div>

      <div v-if="auth.isCEO" class="relative" ref="dropdownRef">
        <button
          type="button"
          class="cursor-pointer"
          @click="dropdownOpen = !dropdownOpen"
        >
          <StatusBadge :status="document.status" class="transition hover:ring-2 hover:ring-indigo-300" />
        </button>

        <div
          v-if="dropdownOpen"
          class="absolute right-0 z-20 mt-1 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button
            v-for="s in DOCUMENT_STATUSES"
            :key="s"
            type="button"
            class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition hover:bg-slate-50"
            :class="s === document.status ? 'font-semibold text-indigo-600' : 'text-slate-700'"
            @click="changeStatus(s)"
          >
            <StatusBadge :status="s" />
            <span v-if="s === document.status" class="ml-auto text-xs text-indigo-400">current</span>
          </button>
        </div>
      </div>

      <StatusBadge v-else :status="document.status" />
    </div>

    <p class="mt-3 text-sm text-slate-600">
      {{ document.description }}
    </p>

    <div v-if="document.aiSummary" class="mt-4 rounded-lg bg-slate-50 p-3">
      <p class="text-xs font-semibold text-slate-500">AI Summary</p>
      <p class="mt-1 text-sm text-slate-700">{{ document.aiSummary }}</p>
    </div>

    <div class="mt-4">
      <RouterLink
        :to="`/documents/${document.id}`"
        class="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-100 hover:text-indigo-700"
      >
        View details
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { DOCUMENT_STATUSES } from '../../constants/documents'
import { useAuthStore } from '../../stores/authStore'
import { useDocumentStore } from '../../stores/documentStore'
import type { DocumentItem, DocumentStatus } from '../../types/document'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{
  document: DocumentItem
}>()

const auth = useAuthStore()
const docs = useDocumentStore()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

async function changeStatus(newStatus: DocumentStatus) {
  dropdownOpen.value = false
  if (newStatus === props.document.status) return
  await docs.editDocument(props.document.id, { status: newStatus })
}

function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside, true))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside, true))
</script>
