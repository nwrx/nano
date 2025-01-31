<script setup lang="ts">
import type { FlowNodePortJSON } from '@nwrx/api'

const props = defineProps<{
  nodeId: string
  portId: string
  kind: 'source' | 'target'
  value: unknown
} & FlowNodePortJSON>()

const emit = defineEmits<{
  setValue: [value: unknown]
  grab: [state: FlowDragState]
  assign: [state: FlowDragState | void]
  release: []
}>()

// --- Use the `useModel` composition function to create a two-way binding.
const model = useVModel(props, 'value', emit, {
  passive: true,
  eventName: 'setValue',
})

// --- Reference to the color pin HTML element.
const pin = ref<HTMLDivElement>()
defineExpose({ pin })

// --- Handle dragging from this pin to create a new
function onGrab(event: MouseEvent) {
  if (!pin.value) return
  if (props.disallowDynamic) return
  if (event.target instanceof HTMLInputElement) return
  if (event.target instanceof HTMLTextAreaElement) return
  if (event.target instanceof HTMLSelectElement) return
  const { x, y, width, height } = pin.value.getBoundingClientRect()
  emit('grab', {
    id: `${props.nodeId}:${props.portId}`,
    color: props.typeColor ?? 'black',
    kind: props.kind,
    position: {
      x: x + width / 2,
      y: y + height / 2,
    },
  })
}

// --- When the mouse hovers over a pin, set the target of the new
function onAssign() {
  if (!pin.value) return
  if (props.disallowDynamic) return
  const { x, y, width, height } = pin.value.getBoundingClientRect()
  emit('assign', {
    id: `${props.nodeId}:${props.portId}`,
    color: props.typeColor ?? 'black',
    kind: props.kind,
    position: {
      x: x + width / 2,
      y: y + height / 2,
    },
  })
}

// When the mouse leaves the pin, unset the target of the new
function onUnassign() {
  emit('assign')
}

// --- When the mouse is released, emit the release event.
function onRelease() {
  emit('release')
}
</script>

<template>
  <div
    class="
      flex items-start gap-2
      w-full group
    "
    :class="{
      'h-8': props.display !== 'textarea',
      'pr-5 flex-row': props.kind === 'target',
      'pl-5 flex-row-reverse': props.kind === 'source',
      'hover:bg-primary-200': !props.display || props.disallowStatic,
    }"
    @mousedown="(event: MouseEvent) => onGrab(event)"
    @mouseover="() => onAssign()"
    @mouseout="() => onUnassign()"
    @mouseup.capture="() => onRelease()">

    <!-- Node pin, used to connect to other nodes. -->
    <div
      ref="pin"
      class="h-2 group-hover:scale-115 transition-transform duration-50 shrink-0 mt-3"
      :style="{ backgroundColor: props.typeColor }"
      :class="{
        'rounded-r-lg': kind === 'target',
        'rounded-l-lg': kind === 'source',
        'w-4': !props.disallowDynamic,
        'w-2 ml-2 rounded-lg': props.disallowDynamic,
      }"
    />

    <!-- Display the name -->
    <span
      v-if="!props.display || props.disallowStatic"
      class="truncate text-start px-2 py-1 outline-none"
      v-text="props.name"
    />

    <!-- Display an input field -->
    <FlowEditorPortText
      v-else-if="props.display === 'text'"
      v-model="model as string"
      :name="name"
    />

    <!-- Display a select field -->
    <FlowEditorPortSelect
      v-else-if="props.display === 'select'"
      v-model="model as string"
      :name="name"
      :values="values as string[]"
    />

    <!-- Display a textarea field -->
    <FlowEditorPortTextarea
      v-else-if="props.display === 'textarea'"
      v-model="model as string"
      :name="name"
    />
  </div>
</template>
