<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import DocumentForm from '../components/documents/DocumentForm.vue'
import { createDocument } from '../services/documentService'

const router = useRouter()
const submitting = ref(false)

async function handleSubmit(payload: { title: string; category: string }): Promise<void> {
  submitting.value = true
  try {
    await createDocument(payload)
    await router.push('/documents')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader />
    <div class="flex min-h-[calc(100vh-64px)]">
      <AppSidebar />
      <main class="flex-1 space-y-4 p-6">
        <h2 class="text-lg font-semibold">New Document</h2>
        <p v-if="submitting">Creating document...</p>
        <DocumentForm @submit="handleSubmit" />
      </main>
    </div>
  </div>
</template>
