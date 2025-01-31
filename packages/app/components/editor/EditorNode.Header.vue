<script setup lang="ts">
import { vMarkdown } from '#imports'

const props = defineProps<{
  text?: string
  kind?: string
  name?: string
  description?: string
  icon?: string
  color?: string
  isRunning?: boolean
  isSelected?: boolean
  isDragging?: boolean
}>()

const emit = defineEmits<{
  start: []
  abort: []
  handleGrab: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
}>()

// --- State
const isRunning = computed(() => props.isRunning)
const isRunningThrottled = refThrottled(isRunning, 200)

// --- Click handlers
function handleGrab(event: MouseEvent) {
  // If click is on tooltip content, don't start dragging.
  if ((event.target as HTMLElement).closest('.cursor-auto')) return

  // Only start dragging on left click.
  if (event.button !== 0) return
  emit('handleGrab', event)
}
</script>

<template>
  <div
    :style="{ backgroundColor: `${color}!important` }"
    :class="{ 'cursor-grabbing': isDragging, 'cursor-pointer': !isDragging }"
    class="flex justify-start items-center h-8 pr-sm rd-t"
    @mousedown="(event) => handleGrab(event)"
    @mouseup="(event) => emit('handleRelease', event)">

    <!-- Tooltip -->
    <EditorTooltip class="h-8 flex items-center justify-center">

      <!-- Circle/icon -->
      <div class="w-8 h-8 flex items-center justify-center">
        <BaseIcon v-if="icon" :icon="icon" class="size-4 text-white" load />
      </div>

      <!-- Title -->
      <p class="font-medium text-white" v-text="name" />

      <!-- Tooltip content -->
      <template #tooltip>
        <div class="w-99 divide-y divide-editor">
          <p v-if="description" v-markdown="description" class="px-md py-0 text-app prose" />
          <p class="px-md py-sm font-medium text-app">
            (node): {{ kind }}
          </p>
        </div>
      </template>
    </EditorTooltip>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Debug ID -->
    <p v-if="text" class="text-sm truncate shrink text-white" v-text="text" />

    <!-- Run button / play icon -->
    <BaseButton
      eager
      class="flex items-center justify-center rounded size-5"
      @mousedown.stop
      @click="() => isRunning ? emit('abort') : emit('start')">
      <BaseIcon
        :icon="isRunningThrottled ? 'i-line-md:loading-loop' : 'i-carbon:circle-outline'"
        class="size-4 text-white"
      />
    </BaseButton>
  </div>
</template>
