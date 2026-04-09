<template>
  <section class="space-y-6">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 450 } }"
      class="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white shadow-lg"
    >
      <p class="text-sm/6 text-indigo-100">AI Document Workflow</p>
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p class="mt-2 text-sm text-indigo-100">
        Track workflow status, review recent activity, and keep documents moving.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <article
        v-for="(stat, idx) in stats"
        :key="stat.status"
        v-motion
        :initial="{ opacity: 0, y: 18 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 360, delay: idx * 90 } }"
        class="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        :class="stat.cardClass"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">{{ stat.label }}</p>
          <span class="text-lg">{{ stat.icon }}</span>
        </div>
        <p class="mt-2 text-3xl font-extrabold text-slate-800">{{ stat.count }}</p>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <section
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 140 } }"
        class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-800">Recent Documents</h3>
          <RouterLink
            to="/documents"
            class="rounded-md px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            View all
          </RouterLink>
        </div>
        <div class="space-y-3">
          <div
            v-for="doc in recentDocuments"
            :key="doc.id"
            class="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/40"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-slate-800">{{ doc.title }}</p>
              <p class="text-xs text-slate-500">{{ doc.category }}</p>
            </div>

            <div v-if="auth.isCEO" class="relative">
              <button
                type="button"
                class="cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition hover:ring-2 hover:ring-indigo-300"
                :class="statusBadgeClass(doc.status)"
                @click="toggleDropdown(doc.id)"
              >
                {{ doc.status }}
              </button>
              <div
                v-if="openDropdownId === doc.id"
                v-click-outside="() => (openDropdownId = null)"
                class="absolute right-0 z-20 mt-1 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              >
                <button
                  v-for="s in DOCUMENT_STATUSES"
                  :key="s"
                  type="button"
                  class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition hover:bg-slate-50"
                  :class="s === doc.status ? 'font-semibold text-indigo-600' : 'text-slate-700'"
                  @click="changeStatus(doc.id, s)"
                >
                  <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusBadgeClass(s)">{{ s }}</span>
                  <span v-if="s === doc.status" class="ml-auto text-xs text-indigo-400">current</span>
                </button>
              </div>
            </div>

            <span v-else class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {{ doc.status }}
            </span>
          </div>
          <p v-if="!recentDocuments.length" class="text-sm text-slate-500">
            No documents yet.
          </p>
        </div>
      </section>

      <div
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 200 } }"
      >
        <AiSummaryPanel />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { DOCUMENT_STATUS_META, DOCUMENT_STATUSES } from '../constants/documents'
import { useAuthStore } from '../stores/authStore'
import { useDocumentStore } from '../stores/documentStore'
import type { DocumentStatus } from '../types/document'
import AiSummaryPanel from '../components/ai/AiSummaryPanel.vue'

const auth = useAuthStore()
const store = useDocumentStore()

onMounted(() => {
  store.fetchDocuments()
  document.addEventListener('click', handleOutsideClick, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick, true)
})

const openDropdownId = ref<string | null>(null)

function toggleDropdown(docId: string) {
  openDropdownId.value = openDropdownId.value === docId ? null : docId
}

async function changeStatus(docId: string, newStatus: DocumentStatus) {
  const doc = store.items.find((d) => d.id === docId)
  openDropdownId.value = null
  if (!doc || doc.status === newStatus) return
  await store.editDocument(docId, { status: newStatus })
}

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    openDropdownId.value = null
  }
}

function statusBadgeClass(status: DocumentStatus): string {
  switch (status) {
    case 'Draft':
      return 'bg-slate-200 text-slate-700'
    case 'Review':
      return 'bg-amber-100 text-amber-700'
    case 'Approved':
      return 'bg-emerald-100 text-emerald-700'
    case 'Rejected':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const stats = computed(() =>
  DOCUMENT_STATUS_META.map((meta) => ({
    ...meta,
    count: store.items.filter((d) => d.status === meta.status).length,
  })),
)

const recentDocuments = computed(() => store.items.slice(0, 5))
</script>
