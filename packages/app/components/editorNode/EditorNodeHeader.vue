<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import EditorTooltip from '~/components/editor/EditorTooltip.vue'
import EditorNodeTooltip from '~/components/editorNode/EditorNodeTooltip.vue'

defineProps<{
  node?: FlowNodeObject
  color?: string
}>()

const isGrabbing = ref(false)
</script>

<template>
  <div
    class="flex justify-start items-center h-8 pr-sm rd-t"
    @mousedown="() => isGrabbing = true"
    @mouseup="() => isGrabbing = false">

    <!-- Tooltip -->
    <EditorTooltip class="h-8 flex items-center justify-center">
      <div v-if="node?.component.icon" class="size-8 flex items-center justify-center">
        <BaseIcon :icon="node.component.icon" class="size-5 text-white rd" load />
      </div>

      <!-- Title -->
      <p class="font-medium text-white">
        {{ node?.component.title || node?.name || 'MISSING_NODE_PROP' }}
      </p>

      <!-- Tooltip content -->
      <template #tooltip>
        <EditorNodeTooltip :node="node" />
      </template>
    </EditorTooltip>
  </div>
</template>
