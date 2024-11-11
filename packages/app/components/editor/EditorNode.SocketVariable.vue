<script setup lang="ts">
import { createReference } from '@nwrx/core/utils'

const props = defineProps<{
  modelValue?: string
  name?: string
  secrets?: string[]
  variables?: string[]
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
    label: secret,
    value: createReference('fromSecret', { name: secret }),
  })),
  ...(props.variables ?? []).map(variable => ({
    label: variable,
    value: createReference('fromVariable', { name: variable }),
    icon: 'https://api.iconify.design/carbon:value-variable.svg',
  })),
])

function getOptions(query: string) {
  return Promise.resolve(options.value.filter(option => option.label.includes(query)))
}
</script>

<template>
  <EditorNodeSocketSelect
    v-model="model"
    :name="name"
    :options="options"
    :get-options="getOptions"
  />
</template>
