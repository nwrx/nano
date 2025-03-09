<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
import { vMarkdown } from '#imports'

defineProps<{
  editor: Editor
  node: EditorNodeObject
}>()
</script>

<template>
  <div class="w-99 divide-y divide-editor">
    <p
      v-if="node.description"
      v-markdown.html="node.description"
      class="p-md text-app max-h-80 overflow-y-auto markdown"
      @wheel.stop
    />
    <p class="px-md py-sm font-medium text-app">
      (node): {{ node.specifier }}
    </p>
  </div>
</template>
