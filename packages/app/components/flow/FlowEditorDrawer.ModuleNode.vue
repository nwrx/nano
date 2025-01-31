<script setup lang="ts">
import type { FlowNodeJSON } from '@nanoworks/core'
import type { FlowModuleObject } from '~/server/flow'
import type { DropPayload } from '~/utils/types'

const props = defineProps<{
  module: FlowModuleObject
  node: FlowNodeJSON
}>()

function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/json', JSON.stringify(({
    type: 'createNode',
    kind: `${props.module.slug}:${props.node.kind}`,
  } as DropPayload)))
}

const typeColors = computed(() => {
  if (!props.node.dataSchema || !props.node.resultSchema) return []
  const dataPorts = Object.values(props.node.dataSchema).flatMap(port => port.type)
  const resultPorts = Object.values(props.node.resultSchema).flatMap(port => port.type)
  const colors = [...dataPorts, ...resultPorts].map(type => type.color)
  return [...new Set(colors)]
})
</script>

<template>
  <div
    draggable="true"
    class="
      bg-white px-4 py-2 rounded-lg children:pointer-events-none
      hover:bg-gray-100 transition-colors duration-200
      cursor-grab
    "
    @dragstart="(event) => onDragStart(event)">

    <div class="flex items-center space-x-4">

      <!-- Icon -->
      <BaseIcon :icon="node.icon" class="w-8 h-8" load />

      <!-- Vertical bar -->
      <div class="w-px h-8 bg-gray-300"></div>

      <!-- Name & Description -->
      <div class="w-full">
        <div class="text-lg font-bold flex items-center w-full space-x-2">
          <span class="mr-auto">{{ props.node.name }}</span>
          <BaseIcon
            v-for="color in typeColors"
            :key="color"
            :style="{ color }"
            icon="i-carbon:circle-solid"
            class="w-2 h-2 inline-block"
          />
        </div>

        <div class="text-sm opacity-50 line-clamp-1">
          {{ node.description }}
        </div>
      </div>
    </div>
  </div>
</template>
