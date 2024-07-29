<script setup lang="ts">
import type { Schema } from '@hsjm/oblisk-core'

const props = defineProps<{
  id: string
  icon?: string
  label: string
  position: ChainNodePosition
  dataSchema: Schema
  resultSchema: Schema
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: []
  move: [number, number]
  dragSource: [ChainDragState | undefined]
  dragTarget: [ChainDragState | undefined]
  dragDrop: []
}>()

const element = ref<HTMLDivElement>()
const handle = ref<HTMLDivElement>()
const portsData = ref<Record<string, ComponentPublicInstance>>({})
const portsResult = ref<Record<string, ComponentPublicInstance>>({})

/**
 * Expose the edges data and result HTML elements to allow
 * the links to find the exact position of the ports.
 */
defineExpose({ portsData, portsResult })

/** Allow the node to be dragged around the screen. */
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const { x, y, style } = useDraggable(element, {
  initialValue: { x: props.position.x, y: props.position.y },
  onMove: ({ x, y }) => emit('move', x, y),
  onStart: () => emit('select'),
  preventDefault: true,
  handle,
})

/** Watch the `position` prop to update the draggable state. */
watch(() => props.position, (position) => {
  x.value = position.x
  y.value = position.y
})

/**
 * Compute the style of a node field.
 *
 * @param index The index of the field.
 * @param isOutput Whether the field is an output field.
 * @returns The computed style object.
 */
function getFieldStyle(index: number, isOutput?: boolean) {
  return {
    gridRowStart: index + 1,
    gridColumnStart: isOutput ? 2 : 1,
    gridColumnEnd: 'auto',
  }
}
</script>

<template>
  <div
    ref="element"
    :style="style"
    @mousedown.stop="() => emit('select')"
    :class="{
      'ring-primary-600': isSelected,
    }"
    class="
      absolute min-h-[80px] w-[350px] pb-[20px]
      backdrop-blur-sm overflow-hidden
      rounded-md bg-gray-100/80
      ring-1 ring-gray-200
      cursor-pointer
    ">

    <!-- Graphflow Node Header -->
    <div
      ref="handle"
      class="
        flex justify-start items-center
        h-8 w-full px-2 space-x-2
        cursor-move bg-gray-200/80
      ">

      <!-- Circle/icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="w-4 h-4"
        load
      />

      <!-- Title -->
      <p class="font-black">
        {{ label }}
      </p>

      <!-- Progress-bar -->
      <div class="!ml-auto h-2 w-8 bg-green-500 rounded-full"></div>
    </div>

    <!-- Graphflow Node Body -->
    <div class="grid grid-cols-2 gap-1 py-2">
      <ChainEditorPort
        v-for="(port, portId, index) in dataSchema"
        :ref="(component) => portsData[portId] = component as ComponentPublicInstance"
        :key="portId"
        :portId="portId"
        :nodeId="id"
        :name="port.name"
        :color="port.type.color ?? 'gray'"
        :style="getFieldStyle(index, false)"
        kind="data"
        @dragSource="(state) => emit('dragSource', state)"
        @dragTarget="(state) => emit('dragTarget', state)"
        @dragDrop="() => emit('dragDrop')"
      />

      <ChainEditorPort
        v-for="(port, portId, index) in resultSchema"
        :ref="(component) => portsResult[portId] = component as ComponentPublicInstance"
        :key="portId"
        :portId="portId"
        :nodeId="id"
        :name="port.name"
        :color="port.type.color ?? 'gray'"
        :style="getFieldStyle(index, true)"
        kind="result"
        @dragSource="(state) => emit('dragSource', state)"
        @dragTarget="(state) => emit('dragTarget', state)"
        @dragDrop="() => emit('dragDrop')"
      />
    </div>
  </div>
</template>
