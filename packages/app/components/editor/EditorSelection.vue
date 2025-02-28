<script setup lang="ts">
defineProps<{ editor: Editor }>()
</script>

<template>
  <div
    v-if="editor.view.viewSelecting"
    :style="editor.view.viewSelectorStyle"
    class="absolute border-2 border-editor-select border-dashed rounded bg-editor-select z-800"
  />
</template>
