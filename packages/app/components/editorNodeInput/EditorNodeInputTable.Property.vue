<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import EditorNodePin from '~/components/editorNode/EditorNodePin.vue'
import EditorNodeInputValueBadge from './EditorNodeInput.ValueBadge.vue'
import EditorNodeInputTableButton from './EditorNodeInputTable.Button.vue'
import EditorNodeInputTablePropertyBoolean from './EditorNodeInputTable.PropertyBoolean.vue'
import EditorNodeInputTablePropertyName from './EditorNodeInputTable.PropertyName.vue'
import EditorNodeInputTablePropertyNumber from './EditorNodeInputTable.PropertyNumber.vue'
import EditorNodeInputTablePropertyString from './EditorNodeInputTable.PropertyString.vue'

const props = defineProps<{
  name: string
  node: Editor.NodeObject
  schema: Schema
  properties: Record<string, Schema>
  isLast: boolean
  isFirst: boolean
  usedProperties: string[]
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
const valueSchema = computed<Schema | undefined>(() => {
  if (!path.value) return

  // --- Get the schema for the property based on the path.
  const schemaProperty = props.properties[path.value]
  const schemaAdditional = props.schema.additionalProperties
  if (schemaProperty) return schemaProperty
  if (typeof schemaAdditional === 'object') return schemaAdditional

  // --- If no schema could be found, attempt to get a schema based on the value.
  if (typeof value.value === 'boolean') return { type: 'boolean' }
  if (typeof value.value === 'number') return { type: 'number' }
  if (typeof value.value === 'string') return { type: 'string' }
})

// --- Only property with a path are linkable.
const isLinkable = computed(() => !!path.value)
const isHovered = ref(false)
const isValueRefence = computed(() => isReference(value.value))

// --- Check if the value is a reference link.
// const isLinkValue = computed(() => {
//   if (!props.node) return false
//   if (!props.name) return false
//   const model = props.node.input[props.name]
//   return isReferenceLink(model)
// })

function handleMouseEnter() {
  isHovered.value = true
  if (isLinkable.value) emit('assign')
}
function handleMouseLeave() {
  isHovered.value = false
  if (isLinkable.value) emit('unassign')
}
</script>

<template>
  <div
    class="
      b b-transparent b-t-editor bg-emphasized b-b
      hover:b hover:b-active
    "
    @mouseenter="() => handleMouseEnter()"
    @mouseleave="() => handleMouseLeave()">

    <!-- Pin for linking -->
    <div class="flex items-center h-8 ">
      <EditorNodePin
        :node="node"
        :name="name"
        :path="path"
        type="target"
        :schema="valueSchema"
        :is-linkable="isLinkable"
        @mousedown="() => isLinkable && emit('grab')"
      />

      <!-- Select property -->
      <EditorNodeInputTablePropertyName
        v-model:path="path"
        :properties="properties"
        :used-properties="usedProperties"
        :additional-properties="schema.additionalProperties"
      />

      <!-- Value -->
      <div class="flex items-center b-l b-app w-full h-full">
        <EditorNodeInputValueBadge
          v-if="isValueRefence"
          :value="value"
          class="px-sm"
        />
        <span v-else-if="!valueSchema" class="text-subtle text-sm px-sm line-clamp-1 w-full italic">
          Select a property...
        </span>
        <EditorNodeInputTablePropertyBoolean
          v-else-if="valueSchema.type === 'boolean'"
          v-model="value"
        />
        <EditorNodeInputTablePropertyNumber
          v-else-if="valueSchema.type === 'number'"
          v-model="value"
          :max="valueSchema['x-slider-max']"
          :min="valueSchema['x-slider-min']"
          :step="valueSchema['x-slider-step']"
          :default-value="valueSchema.default"
        />
        <EditorNodeInputTablePropertyString
          v-else-if="valueSchema.type === 'string'"
          v-model="value"
          :enum="valueSchema.enum"
        />
      </div>

      <!-- Actions -->
      <div
        class="flex h-full items-center ml-auto op-0"
        :class="{ 'op-100': isHovered }">
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

    <!-- If the field is an array, show additional properties. -->

  </div>
</template>
