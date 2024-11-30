<script setup lang="ts">
import type { FlowNodeDefinitionJSON } from '@nwrx/api'
import type { DropPayload } from '~/utils/types'

const props = defineProps<FlowNodeDefinitionJSON>()

// --- Drag start event handler.
function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/json', JSON.stringify(({
    type: 'createNode',
    kind: props.kind,
  } as DropPayload)))
}

// --- Collect all colors from the data and result schema.
const colors = computed(() => {
  const colors = new Set<string>()
  if (props.inputSchema) {
    for (const socket of props.inputSchema)
      if (socket.typeColor) colors.add(socket.typeColor)
  }
  if (props.outputSchema) {
    for (const socket of props.outputSchema)
      if (socket.typeColor) colors.add(socket.typeColor)
  }
  return [...colors]
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
    <div class="flex items-start space-x-sm">
      <template v-if="icon">
        <img v-if="!icon.endsWith('.svg')" :src="icon" class="size-6 rd">
        <BaseIcon v-else :icon="icon" class="size-6" load />
      </template>

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
