<script setup lang="ts">
const props = defineProps<{
  data: Array<{ name: string; value: unknown }>
  title: string
  text?: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
</script>

<template>
  <FlowEditorPanelSection
    v-model="isOpen"
    :title="title"
    :text="text"
    class-content="group space-y-2">

    <div class="border border-black/10 rounded select-text bg-black/5">
      <FlowEditorPanelSectionDataProperty
        v-for="property in data"
        :key="property.name"
        :name="property.name"
        :value="property.value"
      />
    </div>

  </FlowEditorPanelSection>
</template>
