<script setup lang="ts">
defineProps<{
  name?: string
  isRunning?: boolean
  isBookmarked?: boolean
}>()

const emit = defineEmits<{
  start: []
  abort: []
  bookmark: []
  download: []
}>()
</script>

<template>
  <div class="flex items-center gap-md px-md h-16 rd bg-editor-panel border border-editor backdrop-blur-2xl">
    <h1 class="text-xl">
      {{ name }}
    </h1>

    <!-- Favorite -->
    <EditorFab
      :icon="isBookmarked ? 'i-carbon:bookmark-add' : 'i-carbon:bookmark'"
      @click="() => emit('bookmark')"
    />

    <!-- Vertial divider -->
    <div class="h-full border-r border-editor" />

    <!-- Settings -->
    <EditorFab icon="i-carbon:settings" />

    <!-- Export -->
    <EditorFab
      icon="i-carbon:download"
      @click="() => emit('download')"
    />

    <!-- Start -->
    <EditorFab
      :is-active="isRunning"
      :icon="isRunning ? 'i-line-md:loading-loop' : 'i-carbon:play'"
      @click="() => isRunning ? emit('abort') : emit('start')"
    />
  </div>
</template>
