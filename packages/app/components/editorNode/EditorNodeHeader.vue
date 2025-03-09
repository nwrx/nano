<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
defineProps<{ editor: Editor; node: EditorNodeObject }>()
</script>

<template>
  <div
    :style="{
      backgroundColor: getNodeColor(node),
      cursor: editor.view.nodeDragging ? 'grabbing' : 'pointer',
    }"
    class="flex justify-start items-center h-8 pr-sm rd-t"
    @mouseup="() => editor.view.onNodeHandleRelease()"
    @mousedown.stop="(event) => editor.view.onNodeHandleGrab(event, node.id)">

    <!-- Tooltip -->
    <EditorTooltip class="h-8 flex items-center justify-center">
      <div v-if="node.icon" class="size-8 flex items-center justify-center">
        <BaseIcon :icon="node.icon" class="size-5 text-white rd" load />
      </div>

      <!-- Title -->
      <p class="font-medium text-white" v-text="node.label ?? node.name" />

      <!-- Tooltip content -->
      <template #tooltip>
        <EditorNodeTooltip :editor="editor" :node="node" />
      </template>
    </EditorTooltip>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Run button / play icon -->
    <BaseButton eager @mousedown.stop>
      <BaseIcon
        :icon="editor.model.isRunning ? 'i-line-md:loading-loop' : 'i-carbon:circle-outline'"
        class="size-4 text-white"
      />
    </BaseButton>
  </div>
</template>
