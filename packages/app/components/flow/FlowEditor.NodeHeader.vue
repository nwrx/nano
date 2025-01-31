<script setup lang="ts">
import { vMarkdown } from '#imports'

const props = defineProps<{
  id: string
  kind: string
  name: string
  description: string
  icon: string
  color: string
  isRunning: boolean
  isSelected: boolean
  isDragging: boolean
}>()

const emit = defineEmits<{
  start: []
  abort: []
  handleGrab: [event: MouseEvent]
  handleMove: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
}>()

// --- State
const isRunning = computed(() => props.isRunning)
const isRunningThrottled = refThrottled(isRunning, 200)

// --- Click handlers
function handleGrab(event: MouseEvent) {
  // If click is on tooltip content, don't start dragging.
  if ((event.target as HTMLElement).closest('.cursor-auto')) return

  // If click is not left click, don't start dragging.
  if (event.button !== 0) return
  emit('handleGrab', event)
}
</script>

<template>
  <div
    :style="{ backgroundColor: `${color}!important` }"
    :class="{ 'cursor-grabbing': isDragging }"
    class="flex justify-start items-center h-8 pr-sm rd-t"
    @mousedown="(event) => handleGrab(event)"
    @mousemove="(event) => emit('handleMove', event)"
    @mouseup="(event) => emit('handleRelease', event)">

    <!-- Tooltip -->
    <FlowEditorTooltip class="h-8 flex items-center justify-center">

      <!-- Circle/icon -->
      <div class="w-8 h-8 flex items-center justify-center">
        <BaseIcon v-if="icon" :icon="icon" class="size-4 text-white" load />
      </div>

      <!-- Title -->
      <p class="font-medium text-white" v-text="name"/>

      <!-- Tooltip content -->
      <template #tooltip>
        <div class="w-99 divide-y divide-editor">
          <p v-markdown="description" class="px-md py-0 text-app prose"/>
          <p class="px-md py-sm font-medium text-app">(node): {{ kind }}</p>
        </div>
      </template>
    </FlowEditorTooltip>

    <!-- Spacer -->
    <div class="flex-1"/>

    <!-- Debug ID -->
    <p v-if="id" class="text-sm truncate shrink text-white" v-text="id.slice(0, 8)"/>

    <!-- Run button / play icon -->
    <BaseButton
      eager
      class="flex items-center justify-center rounded size-5"
      @mousedown.stop
      @click="() => isRunning ? emit('abort') : emit('start')">
      <BaseIcon
        :icon="isRunningThrottled ? 'i-line-md:loading-loop' : 'i-carbon:play-filled'"
        class="size-4 text-white"
      />
    </BaseButton>
  </div>
</template>
