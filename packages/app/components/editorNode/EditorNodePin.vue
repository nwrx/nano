<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import EditorNodeInputTooltip from '../editorNodeInput/EditorNodeInput.Tooltip.vue'

const props = defineProps<{
  name?: string
  path?: string
  node?: Editor.NodeObject
  schema?: Schema
  value?: unknown
  type?: 'source' | 'target'
  isLinkable?: boolean
}>()

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
  if (props.type === 'source') return 'right'
  return props.isLinkable ? 'left' : 'dot'
})

const color = computed(() => {
  if (!props.schema) return 'var(--color-gray-500)'
  return getSchemaTypeColor(props.schema)
})
</script>

<template>
  <EditorTooltip class="self-start">
    <div
      :data-id="dataId"
      :data-color="color"
      class="w-6 h-8 flex items-center self-start transition duration-fast shrink-0 cursor-pointer"
      :class="{
        'pr-sm -translate-x-2px': appearance === 'left',
        'pl-sm translate-x-2px': appearance === 'right',
      }">
      <div
        class="h-2 shrink-0 transition duration-fast"
        :style="{ backgroundColor: color }"
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
