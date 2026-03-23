<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AiSummaryPanel from '../components/ai/AiSummaryPanel.vue'
import StatusBadge from '../components/documents/StatusBadge.vue'
import { getAiSummary } from '../services/aiService'
import { getDocumentById } from '../services/documentService'
import type { DocumentItem } from '../types/document'

const route = useRoute()
const document = ref<DocumentItem>()
const summary = ref('')

const documentId = computed(() => String(route.params.id ?? ''))

onMounted(async () => {
  document.value = await getDocumentById(documentId.value)
  if (document.value) {
    summary.value = await getAiSummary(document.value)
  }
})
</script>

<template>
  <div>
    <AppHeader />
    <div class="flex min-h-[calc(100vh-64px)]">
      <AppSidebar />
      <main class="flex-1 space-y-4 p-6">
        <h2 class="text-lg font-semibold">Document Detail</h2>
        <template v-if="document">
          <h3 class="text-base font-medium">{{ document.title }}</h3>
          <StatusBadge :status="document.status" />
          <AiSummaryPanel :summary="summary" />
        </template>
        <p v-else>Document not found.</p>
      </main>
    </div>
  </div>
</template>
