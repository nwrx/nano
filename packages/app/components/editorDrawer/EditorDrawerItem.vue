<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { DropPayload } from '~/utils/types'
import IconDynamic from '~/components/icon/IconDynamic.vue'
import { getComponentTypeColors } from '~/composables/useEditor'

const props = defineProps<{
  component: Editor.ComponentObject
}>()

// --- Drag start event handler.
function onDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/json', JSON.stringify(({
    type: 'createNode',
    kind: props.component.name,
    inputs: props.component.defaultInputs,
    metadata: props.component.defaultMetadata,
  } as DropPayload)))
}

// --- Collect all colors from the data and result schema.
const colors = computed(() => getComponentTypeColors(props.component))
const title = computed(() => (props.component.title ? localize(props.component.title) : props.component.name))
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
      <IconDynamic
        :name="component.icon"
        class="size-6"
        load
      />

      <!-- Name & Description -->
      <div class="w-full">
        <div class="text-base font-medium flex items-center w-full space-x-sm">

          <!-- Title -->
          <span class="mr-auto">
            {{ title }}
          </span>

          <!-- Icon -->
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
