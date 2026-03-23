<template>
  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="badgeClass">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DocumentStatus } from '../../types/document'

const props = defineProps<{
  status: DocumentStatus
}>()

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Draft':
      return 'bg-slate-200 text-slate-700 ring-1 ring-slate-300'
    case 'Review':
      return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
    case 'Approved':
      return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
    case 'Rejected':
      return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
    default:
      return 'bg-slate-200 text-slate-700 ring-1 ring-slate-300'
  }
})
</script>
