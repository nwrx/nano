<script setup lang="ts">
import type { RegistryComponentObject } from '@nwrx/nano-api'
import type { DropPayload } from '~/utils/types'

const props = defineProps<{
  component: RegistryComponentObject
}>()

const specifier = computed(() => [
  props.component?.collection?.workspace?.name,
  props.component?.collection?.name,
  props.component?.name,
].join('/'))

// --- Drag start event handler.
function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/json', JSON.stringify(({
    type: 'createNode',
    kind: specifier.value,
  } as DropPayload)))
}

// --- Collect all colors from the data and result schema.
const colors = computed(() => getComponentTypeColors(props.component))
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
      <template v-if="component.icon">
        <img v-if="!component.icon.endsWith('.svg')" :src="component.icon" class="size-6 rd">
        <BaseIcon v-else :icon="component.icon" class="size-6" load />
      </template>

      <!-- Name & Description -->
      <div class="w-full">
        <div class="text-base font-medium flex items-center w-full space-x-sm">
          <span class="mr-auto" v-text="component.title" />
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
