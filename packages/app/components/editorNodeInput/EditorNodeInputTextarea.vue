<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import EditorNodeInputGroup from './EditorNodeInput.Group.vue'
import EditorNodeInputLabel from './EditorNodeInput.Label.vue'
import EditorNodeInputValue from './EditorNodeInput.Value.vue'
import EditorNodeInputTextareaDialog from './EditorNodeInputTextarea.Dialog.vue'

defineProps<{
  name?: string
  node?: FlowNodeObject
  schema?: Schema
}>()

const isDialogOpen = ref(false)
const value = defineModel()
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center cursor-text"
    @mousedown.stop="() => isDialogOpen = true">

    <!-- Label -->
    <EditorNodeInputLabel
      :name="name"
      :schema="schema"
    />

    <!-- Value -->
    <EditorNodeInputValue
      :model-value="value"
      :name="name"
      :schema="schema"
      readonly
    />
  </EditorNodeInputGroup>

  <!-- Dialog -->
  <EditorNodeInputTextareaDialog
    v-model="value"
    v-model:show="isDialogOpen"
    :title="schema?.title ?? name"
    :description="schema?.description"
  />
</template>
