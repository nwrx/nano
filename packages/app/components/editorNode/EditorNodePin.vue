<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import { isReferenceLink } from '~/composables/useEditor/isReferenceLink'
import EditorNodeInputTooltip from '../editorNodeInput/EditorNodeInput.Tooltip.vue'

const props = defineProps<{
  name?: string
  path?: string
  node?: FlowNodeObject
  schema?: Schema
  value?: unknown
  type?: 'source' | 'target'
}>()

// --- Check if the model is a link reference.
const isLinkValue = computed(() => {
  if (!props.node) return false
  if (!props.name) return false
  const model = props.node.input[props.name]
  return isReferenceLink(model)
})

// --- Flag that indicates if the input can be linked.
const isLinkable = computed(() => {
  const control = props.schema?.['x-control']
  if (props.path) return true
  if (props.path === '') return false
  if (control === undefined) return true
  return isLinkValue.value
})

const dataId = computed(() => {
  if (!props.node) return
  if (!props.type) return
  if (!props.name) return
  return [
    'pin',
    props.type,
    props.node.id,
    props.name,
    props.path,
  ].filter(Boolean).join('-')
})

const appearance = computed(() => {
  if (!isLinkable.value) return 'dot'
  if (props.type === 'source') return 'right'
  if (props.type === 'target') return 'left'
})
</script>

<template>
  <EditorTooltip class="self-start">
    <div
      :data-id="dataId"
      :data-color="getSchemaTypeColor(schema)"
      class="w-6 h-8 flex items-center self-start transition duration-fast shrink-0 cursor-pointer"
      :class="{
        'pr-sm -translate-x-2px': appearance === 'left',
        'pl-sm translate-x-2px': appearance === 'right',
      }">
      <div
        class="h-2 shrink-0 transition duration-fast"
        :style="{ backgroundColor: getSchemaTypeColor(schema) }"
        :class="{
          'w-4': appearance !== 'dot',
          'rd-r rd-l-sm': appearance === 'left',
          'rd-l rd-r-sm': appearance === 'right',
          'w-2 ml-2 rd-lg': appearance === 'dot',
        }"
      />
    </div>

    <!-- Tooltip content -->
    <template #tooltip>
      <EditorNodeInputTooltip
        :name="name"
        :path="path"
        :schema="schema"
      />
    </template>
  </EditorTooltip>
</template>
