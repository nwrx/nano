<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  description: string
  node: NodeInstanceJSON
  isDataOpen: boolean
  isResultOpen: boolean
}>()

const emit = defineEmits<{
  run: [id: string]
  'update:name': [name: string]
  'update:description': [description: string]
  'update:isDataOpen': [isOpen: boolean]
  'update:isResultOpen': [isOpen: boolean]
}>()

// --- UI state.
const isDataOpen = useVModel(props, 'isDataOpen', emit, { passive: true })
const isResultOpen = useVModel(props, 'isResultOpen', emit, { passive: true })

// --- Data.
const name = useVModel(props, 'name', emit, {
  passive: true,
  defaultValue: props.node.name,
})

const description = useVModel(props, 'description', emit, {
  passive: true,
  description: props.node.description,
})

// --- Formatted data.
const dataResult = computed(() => {
  const dataResult: Array<{ name: string; value: unknown }> = []
  for (const key in props.node.result) {
    const value = props.node.result[key]
    const name = props.node.resultSchema.find(field => field.key === key)?.name ?? key
    dataResult.push({ name, value })
  }
  return dataResult
})

// --- Formatted result.
const dataData = computed(() => {
  const dataData: Array<{ name: string; value: unknown }> = []
  for (const key in props.node.data) {
    const value = props.node.data[key]
    const name = props.node.dataSchema.find(field => field.key === key)?.name ?? key
    dataData.push({ name, value })
  }
  return dataData
})
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <FlowEditorPanelSectionName
      v-model:name="name"
      v-model:description="description"
      placeholder-name="Describe the purpose of this node in the flow."
      placeholder-description="Description to help you remember what this node does."
    />

    <!-- Data fields and values -->
    <FlowEditorPanelSectionData
      v-model:isOpen="isDataOpen"
      :data="dataData"
      title="Data"
    />

    <!-- Result fields and values -->
    <FlowEditorPanelSectionData
      v-model:isOpen="isResultOpen"
      :data="dataResult"
      title="Result"
    />
  </div>
</template>
