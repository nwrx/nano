<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import { vMarkdown } from '#imports'

const props = defineProps<{
  node?: Editor.NodeObject
  component?: Editor.ComponentObject
}>()

const description = computed(() => {
  if (props.component) {
    return props.component.description
      ? localize(props.component.description)
      : 'MISSING_COMPONENT_DESCRIPTION'
  }
  return 'NO_DESCRIPTION'
})
</script>

<template>
  <div class="w-99 divide-y divide-editor">
    <p
      v-markdown.html="description"
      class="p-md text-app max-h-80 overflow-y-auto markdown"
      @wheel.stop
    />

    <!-- Specifier -->
    <p class="px-md py-sm font-semibold text-app font-mono">
      (node): {{ node?.specifier || 'MISSING_NODE_PROP' }}
    </p>
  </div>
</template>
