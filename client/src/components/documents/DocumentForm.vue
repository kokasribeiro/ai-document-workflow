<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  submit: [{ title: string; category: string }]
}>()

const form = reactive({
  title: '',
  category: '',
})

function onSubmit(): void {
  if (!form.title.trim() || !form.category.trim()) return
  emit('submit', { title: form.title.trim(), category: form.category.trim() })
  form.title = ''
  form.category = ''
}
</script>

<template>
  <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
    <input v-model="form.title" placeholder="Title" class="rounded border border-slate-300 px-3 py-2" />
    <input
      v-model="form.category"
      placeholder="Category"
      class="rounded border border-slate-300 px-3 py-2"
    />
    <button type="submit" class="rounded bg-slate-900 px-4 py-2 text-white">Create</button>
  </form>
</template>
