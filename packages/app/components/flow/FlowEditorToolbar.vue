<script setup lang="ts">
defineProps<{
  name?: string
  isRunning?: boolean
  isBookmarked?: boolean
}>()

const emit = defineEmits<{
  run: []
  abort: []
  delete: []
  bookmark: []
  download: []
}>()
</script>

<template>
  <div
    class="
      flex items-center gap-4 px-4 h-16
      bg-primary-50/60 rounded
      border border-black/10
      backdrop-blur-md
    ">

    <h1 class="text-xl">
      {{ name }}
    </h1>

    <!-- Favorite -->
    <FlowEditorToolbarButton
      :icon="isBookmarked ? 'i-carbon:bookmark-add' : 'i-carbon:bookmark'"
      light
      eager
      @click="() => emit('bookmark')"
    />

    <!-- Vertial divider -->
    <div
      class="w-[1px] h-full bg-black/10"
      aria-hidden="true"
    />

    <!-- Settings -->
    <FlowEditorToolbarButton
      icon="i-carbon:settings"
      light
      eager
    />

    <!-- Export -->
    <FlowEditorToolbarButton
      icon="i-carbon:download"
      light
      eager
      @click="() => emit('download')"
    />

    <!-- Start -->
    <FlowEditorToolbarButton
      :icon="isRunning ? 'i-carbon:stop' : 'i-carbon:play'"
      light
      eager
      @click="() => isRunning ? emit('abort') : emit('run')"
    />
  </div>
</template>
