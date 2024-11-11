<script setup lang="ts">
const props = defineProps<{
  isResizing: boolean
}>()

const emit = defineEmits<{
  'startResize': []
  'stopResize': []
}>()

const isResizing = useVModel(props, 'isResizing', emit, { passive: true })
</script>

<template>
  <div
    :class="{
      'op-0': !isResizing,
      '!op-100': isResizing,
    }"
    class="
      absolute top-0 bottom-0 left-0 w-4 cursor-ew-resize
      transition hover:op-50
    "
    @mousedown="() => emit('startResize')"
    @mouseup="() => emit('stopResize')">
    <div class="w-px h-full bg-editor-active" />
  </div>
</template>
