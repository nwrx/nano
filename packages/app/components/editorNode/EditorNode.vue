<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { SchemaOption } from '@nwrx/nano/utils'
import type { CSSProperties } from 'vue'
import EditorNodeHeader from '~/components/editorNode/EditorNodeHeader.vue'
import EditorNodeInput from '~/components/editorNodeInput/EditorNodeInput.vue'
import EditorNodeOutput from '~/components/editorNodeOutput/EditorNodeOutput.vue'

defineProps<{
  node?: FlowNodeObject
  color?: string
  styleHeader?: CSSProperties
  searchOptions: (name: string, query: string) => Promise<SchemaOption[]>
}>()

const emit = defineEmits<{
  'release': []
  'grab': [MouseEvent]
  'setInputValue': [name: string, value: unknown]
  'inputGrab': [name: string, path?: string]
  'inputAssign': [name: string, path?: string]
  'inputUnassign': []
  'outputGrab': [name: string, path?: string]
  'outputAssign': [name: string, path?: string]
  'outputUnassign': []
}>()
</script>

<template>
  <div class="min-h-24 w-100 backdrop-blur-2xl rd ring bg-editor-node">

    <!-- Node Header -->
    <EditorNodeHeader
      :node="node"
      :style="styleHeader"
      @mouseup="() => emit('release')"
      @mousedown.stop="(event) => emit('grab', event)"
    />

    <!-- Node Body -->
    <div v-if="node" class="flex flex-col py-sm relative">
      <EditorNodeInput
        v-for="(schema, name) in node.component.inputs"
        :key="name"
        :name="name"
        :node="node"
        :schema="schema"
        :search-options="searchOptions"
        @set-value="(value) => emit('setInputValue', name, value)"
        @grab="(path) => emit('inputGrab', name, path)"
        @assign="(path) => emit('inputAssign', name, path)"
        @unassign="() => emit('inputUnassign')"
      />
      <EditorNodeOutput
        v-for="(schema, name) in node.component.outputs"
        :key="name"
        :name="name"
        :node="node"
        :schema="schema"
        @grab="(path) => emit('outputGrab', name, path)"
        @assign="(path) => emit('outputAssign', name, path)"
        @unassign="() => emit('outputUnassign')"
      />
    </div>

    <!-- Missing -->
    <div v-else class="flex items-center justify-center h-24">
      MISSING_NODE_PROP
    </div>
  </div>
</template>
