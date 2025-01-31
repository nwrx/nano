<script setup lang="ts">
defineProps<{
  id: string
  name: string
  icon: string
  color: string
  isRunning: boolean
  isSelected: boolean
  isDragging: boolean
}>()

const emit = defineEmits<{
  run: []
  abort: []
  handleGrab: [event: MouseEvent]
  handleMove: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
}>()
</script>

<template>
  <!-- Graphflow Node Header -->
  <div
    :style="{
      backgroundColor: `${color}!important`,
    }"
    class="
      flex justify-start items-center
      h-8 w-full px-2 space-x-2 group
      rounded-t text-white
    "
    :class="{
      'cursor-grabbing': isSelected && isDragging,
      'cursor-grab': !isSelected || !isDragging,
    }"
    @mousedown="(event) => emit('handleGrab', event)"
    @mousemove="(event) => emit('handleMove', event)"
    @mouseup="(event) => emit('handleRelease', event)">

    <!-- Circle/icon -->
    <BaseIcon v-if="icon" :icon="icon" class="size-4" load />

    <!-- Title -->
    <p class="font-medium grow">
      {{ name }}
    </p>

    <!-- Debug ID -->
    <p v-if="id" class="text-sm truncate">
      {{ id.slice(0, 8) }}
    </p>

    <!-- Run button / play icon -->
    <BaseButton
      eager
      class="
        !ml-auto rounded h-5 w-5
        flex items-center justify-center
        opacity-20
        group-hover:opacity-90
        transition-opacity duration-100
        "
      @mousedown.stop
      @click="() => isRunning ? emit('abort') : emit('run')">
      <BaseIcon
        :icon="isRunning ? 'i-carbon:stop-filled-alt' : 'i-carbon:radio-button-checked'"
        class="w-4 h-4 text-white"
      />
    </BaseButton>
  </div>
</template>
