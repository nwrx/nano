<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
import EditorNodePin from '../editorNode/EditorNodePin.vue'

defineProps<{
  name?: string
  schema?: Schema
  node?: FlowNodeObject
}>()

const emit = defineEmits<{
  'grab': [string | undefined]
  'assign': [string | undefined]
  'unassign': []
}>()
</script>

<template>
  <div
    class="flex items-center w-full hover:bg-emphasized cursor-pointer"
    @mousedown.stop="() => emit('grab', undefined)"
    @mouseenter="() => emit('assign', undefined)"
    @mouseleave="() => emit('unassign')">

    <!-- Node pin, used to connect to other nodes. -->
    <div class="truncate px-sm py-xs text-right font-mono text-sm grow">
      {{ schema?.title || name || 'MISSING_INPUT_SCHEMA_AND_NAME' }}
    </div>

    <!-- Node pin, used to connect to other nodes. -->
    <EditorNodePin
      :node="node"
      :name="name"
      :schema="schema"
      type="source"
    />
  </div>
</template>
