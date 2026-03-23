<script setup lang="ts">
import type { DocumentStatus } from '../../types/document'

defineProps<{ status: DocumentStatus }>()
</script>

<template>
  <span class="rounded bg-slate-100 px-2 py-1 text-xs">{{ status }}</span>
</template>
