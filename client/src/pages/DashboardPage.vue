<template>
  <section>
    <h2 class="mb-6 text-3xl font-bold tracking-tight text-slate-800">Dashboard</h2>

    <div class="grid gap-4 md:grid-cols-4">
      <div class="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <p class="text-sm text-slate-500">Draft</p>
        <p class="text-2xl font-bold">{{ draftCount }}</p>
      </div>
      <div class="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <p class="text-sm text-slate-500">Review</p>
        <p class="text-2xl font-bold">{{ reviewCount }}</p>
      </div>
      <div class="rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <p class="text-sm text-slate-500">Approved</p>
        <p class="text-2xl font-bold">{{ approvedCount }}</p>
      </div>
      <div class="rounded-2xl border border-rose-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <p class="text-sm text-slate-500">Rejected</p>
        <p class="text-2xl font-bold">{{ rejectedCount }}</p>
      </div>
    </div>

    <div class="mt-6">
      <AiSummaryPanel />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
</script>
