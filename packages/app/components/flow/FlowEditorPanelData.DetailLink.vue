<script setup lang="ts">
import { type NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  modelValue?: unknown
  nodes?: NodeInstanceJSON[]
  isEditable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// --- State && Two-way binding
const model = useVModel(props, 'modelValue', emit, { passive: true })

// --- Extract the source node and socket from the model value.
const value = computed(() => {
  if (model.value === undefined) return
  if (!props.isEditable) return model.value

  // --- Extract the source node ID and socket key.
  if (typeof model.value !== 'string') return
  const [id, key] = model.value.slice(6).split(':')
  if (!id || !key) return

  // --- Find the node instance by ID.
  const node = props.nodes?.find(n => n.id === id)
  if (!node) return

  // --- Get the value
  return node.result[key]
})
</script>

<template>
  <FlowEditorPanelDataDetail :modelValue="value"/>
</template>
