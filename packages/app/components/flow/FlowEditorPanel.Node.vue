<script setup lang="ts">
import type { FlowNodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  node: FlowNodeInstanceJSON
  name: string
  description: string
}>()

const emit = defineEmits<{
  run: [id: string]
  'update:name': [name: string]
  'update:description': [description: string]
}>()

const title = useVModel(props, 'name', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })

function onTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
}
</script>

<template>
  <div class="space-y-8 overflow-y-auto overflow-x-hidden">

    <!-- Title & Desscription -->
    <div>
      <input
        v-model="name"
        placeholder="Give your flow a name..."
        class="text-2xl font-medium outline-none bg-transparent w-full"
      />
      <textarea
        v-model="description"
        placeholder="Describe your flow..."
        class="text-sm outline-none bg-transparent w-full resize-none opacity-70"
        @input="(event) => onTextareaInput(event)"
      />
    </div>

    <!-- Data fields and values -->
    <div class="space-y-4">
      <div v-for="field in node.dataSchema" :key="field.name" class="text-sm">
        <p class="font-medium">{{ field.name }}</p>
        <p class="opacity-70">{{ node.data[field.key] }}</p>
      </div>
    </div>

    <!-- Result fields and values -->
    <div class="space-y-4">
      <div v-for="field in node.resultSchema" :key="field.name" class="text-sm">
        <p class="font-medium">{{ field.name }}</p>
        <p class="opacity-70">{{ node.result[field.key] }}</p>
      </div>
    </div>
  </div>
</template>
