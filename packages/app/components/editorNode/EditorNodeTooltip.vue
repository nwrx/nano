<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import { vMarkdown } from '#imports'

defineProps<{
  node?: FlowNodeObject
}>()
</script>

<template>
  <div class="w-99 divide-y divide-editor">
    <p
      v-markdown.html="node?.component.description || 'MISSING_NODE_PROP'"
      class="p-md text-app max-h-80 overflow-y-auto markdown"
      @wheel.stop
    />
    <p class="px-md py-sm font-medium text-app">
      (node): {{ node?.specifier || 'MISSING_NODE_PROP' }}
    </p>
  </div>
</template>
