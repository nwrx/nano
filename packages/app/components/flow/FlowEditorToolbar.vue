<script setup lang="ts">
defineProps<{
  name?: string
  isRunning?: boolean
  isBookmarked?: boolean
}>()

const emit = defineEmits<{
  run: []
  abort: []
  bookmark: []
  download: []
}>()
</script>

<template>
  <div
    class="
      flex items-center gap-4 px-4 h-16 rd
      bg-editor-panel border border-editor
      backdrop-blur-2xl
    ">

    <h1 class="text-xl">
      {{ name }}
    </h1>

    <!-- Favorite -->
    <FlowEditorToolbarButton
      :icon="isBookmarked ? 'i-carbon:bookmark-add' : 'i-carbon:bookmark'"
      @click="() => emit('bookmark')"
    />

    <!-- Vertial divider -->
    <div class="h-full border-r border-editor" />

    <!-- Settings -->
    <FlowEditorToolbarButton icon="i-carbon:settings"/>

    <!-- Export -->
    <FlowEditorToolbarButton
      icon="i-carbon:download"
      @click="() => emit('download')"
    />

    <!-- Start -->
    <FlowEditorToolbarButton
      :isActive="isRunning"
      :icon="isRunning ? 'i-line-md:loading-loop' : 'i-carbon:play'"
      @click="() => isRunning ? emit('abort') : emit('run')"
    />
  </div>
</template>
