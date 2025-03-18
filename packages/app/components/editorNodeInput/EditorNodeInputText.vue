<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import type { ComponentInstance } from 'vue'
import EditorNodeInputGroup from './EditorNodeInput.Group.vue'
import EditorNodeInputLabel from './EditorNodeInput.Label.vue'
import EditorNodeInputValue from './EditorNodeInput.Value.vue'

defineProps<{
  name?: string
  node?: FlowNodeObject
  schema?: Schema
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
    />
  </EditorNodeInputGroup>
</template>

<i18n lang="yaml">
en:
  empty: No default value
fr:
  empty: Aucune valeur par défaut
de:
  empty: Kein Standardwert
es:
  empty: Sin valor predeterminado
zh:
  empty: 没有默认值
</i18n>
