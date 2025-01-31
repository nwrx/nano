<script setup lang="ts">
import type { FlowNodeJSON } from '@nwrx/api'
import type { DropPayload } from '~/utils/types'

const props = defineProps<FlowNodeJSON>()

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/json', JSON.stringify(({
    type: 'nodeCreate',
    kind: props.kind,
  } as DropPayload)))
}

const typeColors = computed(() => {
  if (!props.dataSchema || !props.resultSchema) return []
  const colors = new Set<string>()
  for (const port of [...props.dataSchema, ...props.resultSchema])
    if (port.typeColor) colors.add(port.typeColor)
})
</script>

<template>
  <div
    draggable="true"
    class="
      w-full px-2 py-2
      children:pointer-events-none cursor-grab
      hover:bg-white rounded
      border border-transparent
      hover:border-primary-600
      transition-colors duration-200
    "
    @mousedown.stop
    @dragstart="(event) => onDragStart(event)">

    <div class="flex items-center space-x-2">

      <!-- Icon -->
      <BaseIcon :icon="icon" class="w-6 h-6" load />

      <!-- Name & Description -->
      <div class="w-full">
        <div class="text-base font-medium flex items-center w-full space-x-2">

          <!-- Name -->
          <span class="mr-auto">
            {{ name }}
          </span>

          <!-- Type colors -->
          <BaseIcon
            v-for="color in typeColors"
            :key="color"
            :style="{ color }"
            icon="i-carbon:circle-solid"
            class="w-3 h-3 inline-block"
          />
        </div>

        <!--
          <div class="text-xs opacity-50 line-clamp-1">
          {{ description }}
          </div>
        -->
      </div>
    </div>
  </div>
</template>
