<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div>

    <!-- Label -->
    <p
      v-if="title"
      class="text-sm text-subtle mb-xs"
      v-text="title"
    />

    <!-- Data -->
    <div class="b b-editor rd select-text text-sm bg-editor-panel-data">
      <slot />
    </div>
  </div>
</template>
