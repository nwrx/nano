<script setup lang="ts">
const props = defineProps<{
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

const isRunning = computed(() => props.isRunning)
const isRunningThrottled = refThrottled(isRunning, 200)
</script>

<template>
  <!-- Graphflow Node Header -->
  <div
    :style="{
      backgroundColor: `${color}!important`,
    }"
    class="
      flex justify-start items-center
      h-8 w-full px-sm space-x-sm group
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
    <p class="font-medium grow" v-text="name"/>

    <!-- Debug ID -->
    <p v-if="id" class="text-sm truncate" v-text="id.slice(0, 8)"/>

    <!-- Run button / play icon -->
    <BaseButton
      eager
      class="flex items-center justify-center rounded size-5"
      @mousedown.stop
      @click="() => isRunning ? emit('abort') : emit('run')">
      <BaseIcon
        :icon="isRunningThrottled ? 'i-line-md:loading-loop' : 'i-carbon:play-filled'"
        class="size-4 text-white"
      />
    </BaseButton>
  </div>
</template>
