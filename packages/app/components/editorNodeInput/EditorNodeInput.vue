<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema, SchemaOption } from '@nwrx/nano/utils'
import { isReferenceLink } from '~/composables/useEditor/isReferenceLink'
import EditorNodePin from '../editorNode/EditorNodePin.vue'
import EditorNodeInputLink from './EditorNodeInputLink.vue'
import EditorNodeInputSelect from './EditorNodeInputSelect.vue'
import EditorNodeInputTable from './EditorNodeInputTable.vue'
import EditorNodeInputText from './EditorNodeInputText.vue'
import EditorNodeInputTextarea from './EditorNodeInputTextarea.vue'

const props = defineProps<{
  name?: string
  node?: FlowNodeObject
  schema?: Schema
  searchOptions?: (name: string, query: string) => Promise<SchemaOption[]>
}>()

const emit = defineEmits<{
  'grab': [string | undefined]
  'assign': [string | undefined]
  'unassign': []
  'setValue': [unknown]
}>()

const control = computed(() => props.schema?.['x-control'])

// --- Reactive value of the input.
const value = computed({
  get: () => {
    if (!props.node) return
    if (!props.name) return
    return props.node.input[props.name]
  },
  set: (value: any) => emit('setValue', value),
})

// --- Check if the model is a link reference.
const isLinkValue = computed(() => {
  if (!props.node) return false
  if (!props.name) return false
  const model = props.node.input[props.name]
  return isReferenceLink(model)
})

// --- Flag that indicates if the input can be linked.
const isLinkable = computed(() => {
  if (control.value === undefined) return true
  return isLinkValue.value
})
</script>

<template>
  <div
    class="flex items-center w-full relative pr-md py-2px group"
    :class="{ 'hover:bg-emphasized cursor-pointer': isLinkable }"
    @mousedown.stop="() => isLinkable && emit('grab', undefined)"
    @mouseenter="() => isLinkable && emit('assign', undefined)"
    @mouseleave="() => isLinkable && emit('unassign')">

    <!-- Node pin. -->
    <EditorNodePin
      :node="node"
      :name="name"
      :schema="schema"
      type="target"
    />

    <!-- Text Control -->
    <EditorNodeInputText
      v-if="control === 'text'"
      v-model="value"
      :node="node"
      :name="name"
      :schema="schema"
    />

    <!-- Textarea Control -->
    <EditorNodeInputTextarea
      v-else-if="control === 'textarea'"
      v-model="value"
      :node="node"
      :name="name"
      :schema="schema"
    />

    <!-- Select Control -->
    <EditorNodeInputSelect
      v-else-if="control === 'select' || control === 'variable'"
      v-model="value"
      :node="node"
      :name="name"
      :schema="schema"
      :search-options="async(query) => {
        if (!searchOptions) return []
        if (!name) return []
        return searchOptions(name, query)
      }"
    />

    <!-- Table Control -->
    <EditorNodeInputTable
      v-else-if="control === 'table'"
      v-model="value"
      :node="node"
      :name="name"
      :schema="schema"
      @grab="path => emit('grab', path)"
      @assign="path => emit('assign', path)"
      @unassign="() => emit('unassign')"
    />

    <!-- Link Control -->
    <EditorNodeInputLink
      v-else-if="control === undefined"
      :name="name"
      :schema="schema"
    />

    <!-- Debug -->
    <p v-else class="text-xs font-mono text-app bg-prominent b b-app rd-md px-sm py-xs">
      <span>{{ schema?.title ?? name }} ({{ schema?.type ?? 'any' }} - {{ control ?? 'none' }})</span>
    </p>
  </div>
</template>
