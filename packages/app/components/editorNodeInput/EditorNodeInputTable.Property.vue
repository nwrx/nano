<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import EditorNodePin from '~/components/editorNode/EditorNodePin.vue'
import { isReferenceLink } from '~/composables/useEditor/isReferenceLink'
import EditorNodeInputTablePropertyBoolean from './EditorNodeInputTable.PropertyBoolean.vue'
import EditorNodeInputTablePropertyName from './EditorNodeInputTable.PropertyName.vue'
import EditorNodeInputTablePropertyNumber from './EditorNodeInputTable.PropertyNumber.vue'
import EditorNodeInputTablePropertyString from './EditorNodeInputTable.PropertyString.vue'

const props = defineProps<{
  name?: string
  node?: FlowNodeObject
  schema?: Schema
  isLast?: boolean
  isFirst?: boolean
  usedProperties?: string[]
}>()

const emit = defineEmits<{
  removeProperty: []
  addProperty: []
  grab: []
  assign: []
  unassign: []
}>()

const path = defineModel('propertyPath', { default: '' })
const value = defineModel('propertyValue')

// --- Get the property schema based on the dynamic name.
const propertySchema = computed(() => {
  if (!props.schema) return { type: 'string' } as Schema
  if (!path.value) return { type: 'string' } as Schema
  const schemaProperty = props.schema.properties?.[path.value]
  const schemaAdditional = props.schema.additionalProperties
  if (schemaProperty) return schemaProperty
  if (typeof schemaAdditional === 'object') return schemaAdditional
  return { type: 'string' } as Schema
})

// --- Only property with a path are linkable.
const isLinkable = computed(() => !!path.value)

// --- Check if the value is a reference link.
// const isLinkValue = computed(() => {
//   if (!props.node) return false
//   if (!props.name) return false
//   const model = props.node.input[props.name]
//   return isReferenceLink(model)
// })
</script>

<template>
  <div
    class="
      flex items-center h-8 b b-transparent b-t-editor bg-emphasized b-b
      hover:b hover:b-active
    "
    @mouseenter="() => isLinkable && emit('assign')"
    @mouseleave="() => isLinkable && emit('unassign')">

    <EditorNodePin
      :node="node"
      :name="name"
      :path="path"
      :schema="propertySchema"
      type="target"
      @mousedown="() => isLinkable && emit('grab')"
    />

    <!-- Select property -->
    <EditorNodeInputTablePropertyName
      v-model:path="path"
      :properties="schema?.properties"
      :additional-properties="schema?.additionalProperties"
      :used-properties="usedProperties"
    />

    <!-- Value -->
    <div class="b-l b-editor w-full h-full">
      <EditorNodeInputTablePropertyBoolean
        v-if="propertySchema.type === 'boolean'"
        v-model="value"
      />
      <EditorNodeInputTablePropertyNumber
        v-else-if="propertySchema.type === 'number'"
        v-model="value"
        :max="propertySchema['x-slider-max']"
        :min="propertySchema['x-slider-min']"
        :step="propertySchema['x-slider-step']"
        :default-value="propertySchema.default"
      />
      <EditorNodeInputTablePropertyString
        v-else
        v-model="value"
      />
    </div>

    <!-- Add -->
    <div class="flex h-full items-center ml-auto op-0 group-hover:op-100">
      <EditorNodeInputTableButton
        icon="i-carbon:close"
        @click="() => emit('removeProperty')"
      />
      <EditorNodeInputTableButton
        icon="i-carbon:add"
        @click="() => emit('addProperty')"
      />
    </div>
  </div>
</template>
