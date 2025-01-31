<script setup lang="ts">
import type { DataSocketJSON, FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'

const props = defineProps<{
  nodeId: string
  portId: string
  kind: 'source' | 'target'
  value: unknown
  secrets?: FlowSessionSecretJSON[]
  variables?: FlowSessionVariableJSON[]
} & DataSocketJSON>()

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

// --- Determine if the pin is linked to another node.
const isLinked = computed(() => {
  if (!model.value) return false
  if (typeof model.value !== 'string') return false
  return model.value.startsWith('$NODE.')
})

// --- Assert if the control is linkea to another node.
const isLinkeable = computed(() => props.control === 'socket' || !props.control || isLinked.value)

// --- Reference to the color pin HTML element.
const pin = ref<HTMLDivElement>()
defineExpose({ pin })

// --- Handle dragging from this pin to create a new
function onGrab(event: MouseEvent) {
  if (!pin.value) return
  if (!isLinkeable.value) return
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
  if (!isLinkeable.value) return
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
    class="flex items-center space-x-sm w-full"
    :class="{
      'pr-5 flex-row': kind === 'target',
      'pl-5 flex-row-reverse': kind === 'source',
      'hover:bg-emphasized cursor-pointer': isLinkeable,
    }"
    @mousedown="(event: MouseEvent) => onGrab(event)"
    @mouseover="() => onAssign()"
    @mouseout="() => onUnassign()"
    @mouseup="() => onRelease()">

    <!-- Node pin, used to connect to other nodes. -->
    <div
      ref="pin"
      class="self-start mt-3 h-2 shrink-0"
      :style="{ backgroundColor: typeColor }"
      :class="{
        'rounded-r-lg': kind === 'target',
        'rounded-l-lg': kind === 'source',
        'w-4': isLinkeable,
        'w-2 ml-2 rounded-lg': !isLinkeable,
      }"
    />

    <!-- Display the name -->
    <span
      v-if="!control || control === 'socket' || isLinked"
      class="truncate text-start px-sm py-xs outline-none"
      v-text="name"
    />

    <FlowEditorSocketVariable
      v-else-if="control === 'variable'"
      v-model="(model as string)"
      :name="name"
      :secrets="secrets"
      :variables="variables"
      @mousedown.stop
    />

    <!-- Display an input field -->
    <FlowEditorSocketText
      v-else-if="control === 'text'"
      v-model="(model as string)"
      :name="name"
      @mousedown.stop
    />

    <!-- Display a select field -->
    <FlowEditorSocketSelect
      v-else-if="control === 'select'"
      v-model="model"
      :name="name"
      :options="options"
      @mousedown.stop
    />

    <!-- Display a textarea field -->
    <FlowEditorSocketTextarea
      v-else-if="control === 'textarea'"
      v-model="(model as string)"
      :name="name"
      @mousedown.stop
    />

    <!-- Slider -->
    <FlowEditorSocketSlider
      v-else-if="control === 'slider'"
      v-model="(model as number)"
      :name="name"
      :min="sliderMin"
      :max="sliderMax"
      :step="sliderStep"
      @mousedown.stop
    />
  </div>
</template>
