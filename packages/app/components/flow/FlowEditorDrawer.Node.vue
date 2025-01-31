<script setup lang="ts">
import type { NodeJSON } from '@nwrx/api'
import type { DropPayload } from '~/utils/types'

const props = defineProps<NodeJSON>()

// --- Drag start event handler.
function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/json', JSON.stringify(({
    type: 'nodeCreate',
    kind: props.kind,
  } as DropPayload)))
}

// --- Collect all colors from the data and result schema.
const colors = computed(() => {
  const colors: string[] = []
  if (props.dataSchema) {
    for (const socket of props.dataSchema)
      if (socket.typeColor) colors.push(socket.typeColor)
  }
  if (props.resultSchema) {
    for (const socket of props.resultSchema)
      if (socket.typeColor) colors.push(socket.typeColor)
  }
  return colors
})
</script>

<template>
  <div
    draggable="true"
    class="
      w-full p-sm children:pointer-events-none rd cursor-grab
      border border-transparent hover:border-prominent
      hover:bg-prominent
    "
    @mousedown.stop
    @dragstart="(event) => onDragStart(event)">

    <!-- Icon -->
    <div class="flex items-center space-x-sm">
      <BaseIcon :icon="icon" class="size-6" load />

      <!-- Name & Description -->
      <div class="w-full">
        <div class="text-base font-medium flex items-center w-full space-x-sm">
          <span class="mr-auto" v-text="name" />
          <BaseIcon
            v-for="color in colors"
            :key="color"
            :style="{ color }"
            icon="i-carbon:circle-solid"
            class="size-3 inline-block"
          />
        </div>
      </div>
    </div>
  </div>
</template>
