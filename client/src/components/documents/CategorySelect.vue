<template>
  <select
    v-model="model"
    class="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
  >
    <option v-if="includeEmpty" value="">{{ emptyLabel }}</option>
    <option v-for="c in DOCUMENT_CATEGORIES" :key="c" :value="c">{{ c }}</option>
  </select>
</template>

<script setup lang="ts">
import { DOCUMENT_CATEGORIES } from '../../constants/documents'

const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    includeEmpty?: boolean
    emptyLabel?: string
  }>(),
  {
    includeEmpty: false,
    emptyLabel: 'All categories',
  },
)
</script>
