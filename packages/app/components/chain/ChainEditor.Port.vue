<script setup lang="ts">
const props = defineProps<{
  name: string
  nodeId: string
  portId: string
  color: string
  kind: 'data' | 'result'
}>()

const emit = defineEmits<{
  dragSource: [ChainDragState | undefined]
  dragTarget: [ChainDragState | undefined]
  dragDrop: []
}>()

// --- Reference to the color pin HTML element.
const pin = ref<HTMLDivElement>()
defineExpose({ pin })

// --- Handle dragging from this pin to create a new port.
function setDragSource() {
  const { x, y, width, height } = pin.value!.getBoundingClientRect()
  emit('dragSource', {
    id: `${props.nodeId}:${props.portId}`,
    color: props.color,
    kind: props.kind,
    position: {
      x: x + width / 2,
      y: y + height / 2,
    },
  })
}

// --- When the mouse hovers over a pin, set the target of the new port.
function setDragTarget() {
  const { x, y, width, height } = pin.value!.getBoundingClientRect()
  emit('dragTarget', {
    id: `${props.nodeId}:${props.portId}`,
    color: props.color,
    kind: props.kind,
    position: {
      x: x + width / 2,
      y: y + height / 2,
    },
  })
}

// --- When the mouse leaves the pin, unset the target of the new port.
function unsetDragTarget() {
  // eslint-disable-next-line unicorn/no-useless-undefined
  emit('dragTarget', undefined)
}

// --- When the mouse is released, emit an event to create the new port.
function dragDrop() {
  emit('dragDrop')
}
</script>

<template>
  <div
    @mousedown="() => setDragSource()"
    @mouseover="() => setDragTarget()"
    @mouseout="() => unsetDragTarget()"
    @mouseup="() => dragDrop()"
    class="
      flex items-center gap-2 children:pointer-events-none
      hover:bg-gray-300 py-1
    "
    :class="{
      'rounded-r-lg pr-2 flex-row': kind === 'data',
      'rounded-l-lg pl-2 flex-row-reverse': kind === 'result',
    }">

    <!-- Node pin, used to connect to other nodes. -->
    <div
      :id="`${nodeId}:${portId}`"
      ref="pin"
      class="w-4 h-2"
      :style="{ backgroundColor: color }"
      :class="{
        'rounded-r-lg': kind === 'data',
        'rounded-l-lg': kind === 'result',
      }"
    />

    <!-- Node field name. -->
    <span
      class="truncate"
      v-text="name"
    />
  </div>
</template>
