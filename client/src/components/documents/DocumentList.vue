<script setup lang="ts">
import type { DocumentItem } from '../../types/document'
import DocumentCard from './DocumentCard.vue'

defineProps<{ documents: DocumentItem[] }>()
</script>

<template>
  <section class="grid gap-3">
    <DocumentCard v-for="document in documents" :key="document.id" :document="document" />
  </section>
</template>
