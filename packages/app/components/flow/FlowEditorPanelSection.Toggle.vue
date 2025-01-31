<script setup lang="ts">
const props = defineProps<{
  isOpen?: boolean
  title: string
  text: string
  values: Array<{ value: string; icon: string; label: string; hint: string }>
  modelValue: string | string[]
  type: 'checkbox' | 'radio'
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
  'update:modelValue': [value: string | string[]]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <FlowEditorPanelSection
    v-model="isOpen"
    :title="title"
    :text="text"
    class-content="grid grid-cols-3 gap-4">

    <!-- Values -->
    <FlowEditorPanelSectionInputToggle
      v-for="(value, index) in values"
      :key="index"
      v-model="model as any"
      :value="value.value as any"
      :icon="value.icon"
      :label="value.label"
      :hint="value.hint"
      :type="type"
    />
  </FlowEditorPanelSection>
</template>
