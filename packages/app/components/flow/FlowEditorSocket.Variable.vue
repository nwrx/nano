<script setup lang="ts">
import type { FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'

const props = defineProps<{
  modelValue?: string
  name?: string
  secrets?: FlowSessionSecretJSON[]
  variables?: FlowSessionVariableJSON[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

// --- Use the `useModel` composition function to create a two-way binding.
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

const options = computed(() => [
  ...(props.secrets ?? []).map(secret => ({
    label: secret.name,
    value: `$SECRET.${secret.name}`,
  })),
  ...(props.variables ?? []).map(variable => ({
    label: variable.name,
    value: `$VARIABLE.${variable.name}`,
    icon: 'https://api.iconify.design/carbon:value-variable.svg',
  })),
])
</script>

<template>
  <FlowEditorSocketSelect
    v-model="model"
    :name="name"
    :options="options"
  />
</template>
