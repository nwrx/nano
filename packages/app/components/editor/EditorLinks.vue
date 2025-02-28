<script setup lang="ts">
defineProps<{ editor: Editor }>()
</script>

<template>
  <!-- Links between nodes -->
  <EditorLink
    v-for="(link, index) in editor.view.linksProps"
    :key="index"
    v-bind="link"
    class="absolute z-0 pointer-events-none"
    :zoom="editor.view.zoom"
  />

  <!-- Current user link -->
  <EditorLink
    v-if="editor.view.linkDragProps"
    v-bind="editor.view.linkDragProps"
    class="absolute z-1000 pointer-events-none"
    :zoom="editor.view.zoom"
  />
</template>
