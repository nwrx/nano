<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { Schema, SchemaOption } from '@nwrx/nano/utils'
import { isReferenceLink } from '~/composables/useEditor/isReferenceLink'
import EditorNodePin from '../editorNode/EditorNodePin.vue'
import EditorNodeInputLink from './EditorNodeInputLink.vue'
import EditorNodeInputSelect from './EditorNodeInputSelect.vue'
import EditorNodeInputTable from './EditorNodeInputTable.vue'
import EditorNodeInputText from './EditorNodeInputText.vue'
import EditorNodeInputTextarea from './EditorNodeInputTextarea.vue'

const props = defineProps<{
  name: string
  node: Editor.NodeObject
  schema: Schema
  searchOptions: (query: string) => Promise<SchemaOption[]>
  searchProperties: (query: string) => Promise<Record<string, Schema>>
}>()

const emit = defineEmits<{
  'grab': [string | undefined]
  'assign': [string | undefined]
  'unassign': []
  'update': [unknown]
}>()

// --- Reactive value of the input.
const value = computed({
  get: () => {
    if (!props.node) return
    if (!props.name) return
    return props.node.input[props.name]
  },
  set: (value: any) => emit('update', value),
})

// --- Check if the input is linked to a reference.
const isLinked = computed(() => {
  if (!props.node) return false
  if (!props.name) return false
  const model = props.node.input[props.name]
  return isReferenceLink(model)
})

// --- Flag that indicates if the input can be linked.
const control = computed(() => props.schema?.['x-control'])
const isLinkable = computed(() => {
  if (control.value === undefined) return true
  if (control.value === 'reference/provider') return true
  return isLinked.value
})

// --- Check if we should display the `Table` control.
const isTableInput = computed(() => {
  if (control.value === 'reference/provider-options') return true
  return control.value === 'table'
})
</script>

<template>
  <div
    class="flex items-center w-full relative pr-md py-2px group"
    :class="{
      'hover:bg-emphasized cursor-pointer': isLinkable,
      'b b-transparent hover:b-active': control === undefined,
    }"
    @mousedown.stop="() => isLinkable && emit('grab', undefined)"
    @mouseenter="() => isLinkable && emit('assign', undefined)"
    @mouseleave="() => isLinkable && emit('unassign')">

    <!-- Node pin. -->
    <EditorNodePin
      :node="node"
      :name="name"
      :schema="schema"
      :is-linkable="isLinkable"
      type="target"
      :path="undefined"
    />

    <!-- Link Control -->
    <EditorNodeInputLink
      v-if="control === undefined || isLinked"
      :name="name"
      :schema="schema"
    />

    <!-- Text Control -->
    <EditorNodeInputText
      v-else-if="control === 'text'"
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

    <!-- Table Control -->
    <EditorNodeInputTable
      v-else-if="isTableInput"
      v-model="value"
      :node="node"
      :name="name"
      :schema="schema"
      :search-properties="searchProperties"
      @grab="path => emit('grab', path)"
      @assign="path => emit('assign', path)"
      @unassign="() => emit('unassign')"
    />

    <!-- Select Control -->
    <EditorNodeInputSelect
      v-else-if="control === 'select' || control.startsWith('reference/')"
      v-model="value"
      :node="node"
      :name="name"
      :schema="schema"
      :search-options="(query) => searchOptions(query)"
    />

    <!-- Debug -->
    <p v-else class="text-xs font-mono text-app bg-prominent b b-app rd-md px-sm py-xs">
      <span>{{ schema?.title ?? name }} ({{ schema?.type ?? 'any' }} - {{ control ?? 'none' }})</span>
    </p>
  </div>
</template>
