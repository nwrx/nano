<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import type { ComponentInstance } from 'vue'
import EditorNodeInputGroup from './EditorNodeInput.Group.vue'
import EditorNodeInputLabel from './EditorNodeInput.Label.vue'
import EditorNodeInputValue from './EditorNodeInput.Value.vue'

defineProps<{
  name: string
  node: Editor.NodeObject
  schema: Schema
}>()

const value = defineModel()
const inputComponent = ref<ComponentInstance<typeof EditorNodeInputValue>>()

function handleClick() {
  if (!inputComponent.value) return
  inputComponent.value.focus()
}
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center cursor-text"
    @click="() => handleClick()">

    <!-- Label -->
    <EditorNodeInputLabel
      :name="name"
      :schema="schema"
    />

    <!-- Field -->
    <EditorNodeInputValue
      ref="inputComponent"
      v-model="value"
      :name="name"
      :schema="schema"
      :readonly="false"
    />
  </EditorNodeInputGroup>
</template>
