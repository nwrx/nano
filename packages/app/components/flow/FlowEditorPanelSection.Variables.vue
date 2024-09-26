<script setup lang="ts">
const props = defineProps<{
  title: string
  text: string
  createTitle: string
  createText: string
  updateTitle: string
  updateText: string
  isOpen: boolean
  isCreateOpen: boolean
  variables: Array<{ name: string; value?: string }>
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
  'create': [name: string, value: string]
  'update': [name: string, value: string]
  'delete': [name: string]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const isCreateOpen = useVModel(props, 'isCreateOpen', emit, { passive: true })
</script>

<template>
  <FlowEditorPanelSection
    v-model="isOpen"
    :title="title"
    :text="text"
    class-content="group space-y-2">

    <!-- Name -->
    <FlowEditorPanelSectionVariable
      v-for="(variable, index) in variables"
      :key="index"
      :title="updateTitle"
      :text="updateText"
      :name="variable.name"
      :value="variable.value"
      @update="(name, value) => emit('update', name, value)"
      @delete="(name) => emit('delete', name)"
    />

    <!-- Create dialog -->
    <FlowEditorPanelSectionVariableCreate
      v-model:isOpen="isCreateOpen"
      :title="createTitle"
      :text="createText"
      @create="(name, value) => emit('create', name, value)"
    />
  </FlowEditorPanelSection>
</template>
