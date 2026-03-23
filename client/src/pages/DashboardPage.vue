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
        :key="stat.label"
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
        <p class="mt-2 text-3xl font-extrabold text-slate-800">{{ stat.value }}</p>
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
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
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
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useDocumentStore } from '../stores/documentStore'
import AiSummaryPanel from '../components/ai/AiSummaryPanel.vue'

const store = useDocumentStore()

onMounted(() => {
  store.fetchDocuments()
})

const draftCount = computed(() => store.items.filter((d) => d.status === 'Draft').length)
const reviewCount = computed(() => store.items.filter((d) => d.status === 'Review').length)
const approvedCount = computed(() => store.items.filter((d) => d.status === 'Approved').length)
const rejectedCount = computed(() => store.items.filter((d) => d.status === 'Rejected').length)

const stats = computed(() => [
  {
    label: 'Draft',
    value: draftCount.value,
    icon: '📝',
    cardClass: 'border-slate-200/70',
  },
  {
    label: 'Review',
    value: reviewCount.value,
    icon: '🕵️',
    cardClass: 'border-amber-200/70',
  },
  {
    label: 'Approved',
    value: approvedCount.value,
    icon: '✅',
    cardClass: 'border-emerald-200/70',
  },
  {
    label: 'Rejected',
    value: rejectedCount.value,
    icon: '⛔',
    cardClass: 'border-rose-200/70',
  },
])

const recentDocuments = computed(() => store.items.slice(0, 5))
</script>
