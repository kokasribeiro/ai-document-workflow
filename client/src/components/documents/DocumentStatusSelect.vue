<template>
  <select
    v-model="model"
    class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    :class="wide ? 'w-full' : ''"
  >
    <option v-if="includeEmpty" value="">{{ emptyLabel }}</option>
    <option v-for="s in DOCUMENT_STATUSES" :key="s" :value="s">{{ s }}</option>
  </select>
</template>

<script setup lang="ts">
import { DOCUMENT_STATUSES } from '../../constants/documents'

const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    includeEmpty?: boolean
    emptyLabel?: string
    /** Use full width (e.g. filters); compact for inline CEO toolbar */
    wide?: boolean
  }>(),
  {
    includeEmpty: false,
    emptyLabel: 'All statuses',
    wide: true,
  },
)
</script>
