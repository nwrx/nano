<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
import { vMarkdown } from '#imports'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const schema = computed(() => props.node.inputs[props.name])
const type = computed(() => schema.value.type ?? schema.value['x-type'])
</script>

<template>
  <div class="w-100 divide-y divide-editor">
    <p
      v-if="schema.description"
      v-markdown.html="schema.description"
      class="p-md text-app max-h-80 overflow-y-auto markdown"
      @wheel.stop
    />
    <p class="px-md py-sm font-medium text-app">
      ({{ type }}): {{ name }}
    </p>
  </div>
</template>
