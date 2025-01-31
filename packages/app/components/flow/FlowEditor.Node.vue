<script setup lang="ts">
import type { FlowSessionSecretJSON, FlowSessionVariableJSON, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  id: string
  zoom: number
  isDragging: boolean
  isSelected: boolean
  isHighlighted: boolean
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
} & NodeInstanceJSON>()

const emit = defineEmits<{
  start: []
  abort: []
  click: [event: MouseEvent]
  setDataValue: [portId: string, value: unknown]
  portGrab: [FlowDragState]
  portAssign: [FlowDragState | void]
  portRelease: []
  handleGrab: [event: MouseEvent]
  handleMove: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
}>()

// --- State
const isRunning = computed(() => props.state.startsWith('RUNNING'))
const isRunningThrottled = refThrottled(isRunning, 300)
const dataSchema = computed(() => props.dataSchema.filter(x => !x.isInternal))
const resultSchema = computed(() => props.resultSchema.filter(x => !x.isInternal))

/**
 * Expose the ports components to the parent component so their
 * position can be accessed and used to create links between nodes.
 */
const socketsData = ref<Record<string, ComponentPublicInstance>>({})
const socketsResult = ref<Record<string, ComponentPublicInstance>>({})
defineExpose({ socketsData, socketsResult })

/**
 * Compute the ring color based on the node's state. If the node is
 * selected or running, the ring will be colored. Otherwise, it will
 * be transparent.
 */
const ringColor = computed(() => (
  isRunningThrottled.value || props.isSelected || props.isHighlighted
    ? props.categoryColor
    : 'transparent'
))

/**
 * Compute the width of the ring based on the node's state and the
 * current zoom level. If the node is running or selected, the ring
 * width will be 3x the default width. Otherwise, it will be 1.25x.
 */
const ringWidth = computed(() => (
  isRunningThrottled.value || props.isSelected || props.isHighlighted
    ? `${3 / props.zoom}px`
    : `${5 / props.zoom}px`
))

/**
 * Handle the click event on the node. This will emit the `click`
 * event to the parent component with the original event object.
 *
 * @param event The mouse event that triggered the click.
 */
function handleClick(event: MouseEvent) {
  if (event.button === 0) event.stopPropagation()
  emit('click', event)
}
</script>

<template>
  <div
    :style="{
      '--un-ring-color': ringColor,
      '--un-ring-width': ringWidth,
    }"
    class="
      min-h-24 w-100
      backdrop-blur-2xl rd ring
      bg-editor-node
    "
    @mousedown="(event) => handleClick(event)">

    <!-- Error Overlay -->
    <div
      v-if="error"
      class="
        absolute top-0 left-0 right-0 bottom-0
        bg-diagonalstripes-danger-500/30
        mask-to-t pointer-events-none
      "
    />

    <!-- Header -->
    <FlowEditorNodeHeader
      :id="state"
      :kind="kind"
      :name="name"
      :icon="icon"
      :description="description"
      :color="isSelected ? categoryColor : `${categoryColor}D0`"
      :is-running="isRunning"
      :is-dragging="isDragging"
      :is-selected="isSelected"
      @start="() => emit('start')"
      @abort="() => emit('abort')"
      @handle-grab="(event) => emit('handleGrab', event)"
      @handle-move="(event) => emit('handleMove', event)"
      @handle-release="(event) => emit('handleRelease', event)"
    />

    <!-- Graphflow Node Body -->
    <div class="flex flex-col py-sm space-y-xs z-10">
      <FlowEditorSocket
        v-for="port in dataSchema"
        v-bind="port"
        :key="port.key"
        :ref="(component) => socketsData[port.key] = (component as ComponentPublicInstance)"
        :port-id="port.key"
        :node-id="id"
        :value="data?.[port.key]"
        :secrets="secrets"
        :variables="variables"
        :error="dataParseErrors[port.key]"
        kind="target"
        @set-value="(value) => emit('setDataValue', port.key, value)"
        @grab="(state) => emit('portGrab', state)"
        @assign="(state) => emit('portAssign', state)"
        @release="() => emit('portRelease')"
        @drop="() => emit('portRelease')"
      />
      <FlowEditorSocket
        v-for="port in resultSchema"
        v-bind="port"
        :key="port.key"
        :ref="(component) => socketsResult[port.key] = (component as ComponentPublicInstance)"
        :port-id="port.key"
        :node-id="id"
        :value="result?.[port.key]"
        :error="resultParseErrors[port.key]"
        kind="source"
        @set-value="(value) => emit('setDataValue', port.key, value)"
        @grab="(state) => emit('portGrab', state)"
        @assign="(state) => emit('portAssign', state)"
        @release="() => emit('portRelease')"
        @drop="() => emit('portRelease')"
      />
    </div>
  </div>
</template>
