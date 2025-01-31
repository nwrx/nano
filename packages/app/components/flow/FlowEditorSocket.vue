<script setup lang="ts">
import type { DataSocketJSON, FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'

const props = defineProps<{
  id: string
  kind: 'source' | 'target'
  value: unknown
  error?: string
  secrets?: FlowSessionSecretJSON[]
  variables?: FlowSessionVariableJSON[]
  socket: DataSocketJSON
}>()

const emit = defineEmits<{
  setValue: [value: unknown]
  searchOptions: [key: string, query: string]
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
const isLinkeable = computed(() => props.socket.control === 'socket' || !props.socket.control || isLinked.value)

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
    id: `${props.id}:${props.socket.key}`,
    color: props.socket.typeColor ?? 'black',
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
    id: `${props.id}:${props.socket.key}`,
    color: props.socket.typeColor ?? 'black',
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
      'bg-diagonallines-danger-500/80': error,
    }"
    @mousedown="(event: MouseEvent) => onGrab(event)"
    @mouseover="() => onAssign()"
    @mouseout="() => onUnassign()"
    @mouseup="() => onRelease()">

    <!-- Node pin, used to connect to other nodes. -->
    <div
      ref="pin"
      class="self-start mt-3 h-2 shrink-0"
      :style="{ backgroundColor: socket.typeColor }"
      :class="{
        'rounded-r-lg': kind === 'target',
        'rounded-l-lg': kind === 'source',
        'w-4': isLinkeable,
        'w-2 ml-2 rounded-lg': !isLinkeable,
      }"
    />

    <!-- Linkeable pin, used to connect to other nodes. -->
    <FlowEditorSocketLink
      v-if="isLinkeable"
      :name="socket.name"
      :is-linked="isLinked"
      :default-value="socket.defaultValue"
    />

    <!-- Variable & secret input -->
    <FlowEditorSocketVariable
      v-else-if="socket.control === 'variable'"
      v-model="(model as string)"
      :name="socket.name"
      :secrets="secrets"
      :variables="variables"
      :default-value="socket.defaultValue"
    />

    <!-- Text input -->
    <FlowEditorSocketText
      v-else-if="socket.control === 'text'"
      v-model="(model as string)"
      :name="socket.name"
      :default-value="socket.defaultValue"
    />

    <!-- Select input -->
    <FlowEditorSocketSelect
      v-else-if="socket.control === 'select'"
      v-model="model"
      :name="socket.name"
      :default-value="socket.defaultValue"
      :options="socket.options"
      @search="(query) => emit('searchOptions', socket.key, query)"
    />

    <!-- Radio -->
    <FlowEditorSocketRadio
      v-else-if="socket.control === 'radio'"
      v-model="model"
      :name="socket.name"
      :default-value="socket.defaultValue"
      :options="socket.options"
    />

    <!-- Textarea input -->
    <FlowEditorSocketTextarea
      v-else-if="socket.control === 'textarea'"
      v-model="(model as string)"
      :name="socket.name"
      :default-value="socket.defaultValue"
    />

    <!-- Slider -->
    <FlowEditorSocketSlider
      v-else-if="socket.control === 'slider'"
      v-model="(model as number)"
      :name="socket.name"
      :min="socket.sliderMin"
      :max="socket.sliderMax"
      :step="socket.sliderStep"
      :default-value="socket.defaultValue"
    />
  </div>
</template>
