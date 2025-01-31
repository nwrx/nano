<script setup lang="ts">
const props = defineProps<{
  title: string
  text: string
  createTitle: string
  createText: string
  createLabel: string
  updateTitle: string
  updateText: string
  isOpen: boolean
  isCreateOpen?: boolean
  variables: Array<{ name: string; value?: string }>
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
  'create': [name: string, value: string]
  'update': [name: string, value: string]
  'delete': [name: string]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const newVariable = ref<{ name: string; value: string }>()

function createVariableStart() {
  newVariable.value = { name: 'NEW_VARIABLE', value: '' }
}

function createVariableEnd(name: string, value: string) {
  emit('create', name, value)
  newVariable.value = undefined
}
</script>

<template>
  <FlowEditorPanelSection
    v-model="isOpen"
    :title="title"
    :text="text"
    class-content="group space-y-2">

    <!-- Current variables -->
    <FlowEditorPanelSectionVariable
      v-for="(variable, index) in variables"
      :key="index"
      :name="variable.name"
      :value="variable.value"
      :dialog-title="updateTitle"
      :dialog-text="updateText"
      is-editable
      @delete="() => emit('delete', variable.name)"
      @update="(value) => emit('update', variable.name, value)"
    />

    <!-- Temporary create variable -->
    <FlowEditorPanelSectionVariable
      v-if="newVariable"
      v-model:name="newVariable.name"
      v-model:value="newVariable.value"
      is-creating
      @delete="() => newVariable = undefined"
      @create="(name, value) => createVariableEnd(name, value)"
    />

    <!-- Create -->
    <BaseButton
      eager
      :label="createLabel"
      class="
        px-2 py-1 rounded
        font-mono font-medium text-xs
        bg-primary-100 text-primary-500
        hover:bg-primary-500 hover:text-white
      "
      @click="() => createVariableStart()"
    />
  </FlowEditorPanelSection>
</template>
