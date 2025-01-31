<script setup lang="ts">
import type { FlowSessionSecretJSON, FlowSessionVariableJSON, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  id: string
  color: string
  zoom: number
  isRunning: boolean
  isDragging: boolean
  isSelected: boolean
  isCollapsed: boolean
  isHighlighted: boolean
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
} & NodeInstanceJSON>()

const emit = defineEmits<{
  start: []
  abort: []
  click: [event: MouseEvent]
  setDataValue: [portId: string, value: unknown]
  setCollapsed: [value: boolean]
  portGrab: [FlowDragState]
  portAssign: [FlowDragState | void]
  portRelease: []
  handleGrab: [event: MouseEvent]
  handleMove: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
}>()

// --- State
const isCollapsed = ref(false)
const isRunning = computed(() => props.isRunning)
const isRunningThrottled = refThrottled(isRunning, 200)
watch(isCollapsed, value => emit('setCollapsed', value))

/**
 * When the node is collapsed, we only want to display the ports that
 * are connected to other nodes. Anything else should be hidden.
 */
const dataSchema = computed(() => {
  if (!props.id) return []
  if (!props.dataSchema) return []
  if (!isCollapsed.value) return props.dataSchema
  return props.dataSchema.filter((port) => {
    const value = props.data?.[port.key]
    if (typeof value !== 'string') return false
    return value.startsWith('$NODE.')
  })
})

/**
 * Default the result schema to an empty array if the `dataSchema` is
 * not provided. This is to prevent the component from crashing.
 */
const resultSchema = computed(() => {
  if (!props.id) return []
  if (!props.resultSchema) return []
  return props.resultSchema
})

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
    ? props.color
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
        bg-diagonalstripes-red/20
        gradient-mask-t pointer-events-none
      "
    />

    <!-- Header -->
    <FlowEditorNodeHeader
      :id="id"
      :kind="kind"
      :name="name"
      :icon="icon"
      :description="description"
      :color="isSelected ? color : `${color}D0`"
      :isRunning="isRunning"
      :isDragging="isDragging"
      :isSelected="isSelected"
      @start="() => emit('start')"
      @abort="() => emit('abort')"
      @handleGrab="(event) => emit('handleGrab', event)"
      @handleMove="(event) => emit('handleMove', event)"
      @handleRelease="(event) => emit('handleRelease', event)"
    />

    <!-- Graphflow Node Body -->
    <div class="flex flex-col py-sm space-y-xs">
      <FlowEditorSocket
        v-for="port in dataSchema"
        v-bind="port"
        :ref="(component) => socketsData[port.key] = (component as ComponentPublicInstance)"
        :portId="port.key"
        :nodeId="id"
        :value="data?.[port.key]"
        :secrets="secrets"
        :variables="variables"
        kind="target"
        @setValue="(value) => emit('setDataValue', port.key, value)"
        @grab="(state) => emit('portGrab', state)"
        @assign="(state) => emit('portAssign', state)"
        @release="() => emit('portRelease')"
        @drop="() => emit('portRelease')"
      />
      <FlowEditorSocket
        v-for="port in resultSchema"
        v-bind="port"
        :ref="(component) => socketsResult[port.key] = (component as ComponentPublicInstance)"
        :portId="port.key"
        :nodeId="id"
        :value="result?.[port.key]"
        kind="source"
        @setValue="(value) => emit('setDataValue', port.key, value)"
        @grab="(state) => emit('portGrab', state)"
        @assign="(state) => emit('portAssign', state)"
        @release="() => emit('portRelease')"
        @drop="() => emit('portRelease')"
      />
    </div>

    <!-- Collapse bar -->
    <!--
      <div
      class="
      flex justify-center items-center
      h-8 w-full cursor-pointer
      opacity-0 hover:opacity-100
      bg-primary-500/5
      transition
      rounded-b-md
      "
      @mousedown.stop="() => isCollapsed = !isCollapsed">
      <BaseIcon
      :icon="isCollapsed ? 'i-carbon:chevron-down' : 'i-carbon:chevron-up'"
      class="size-4"
      />
      </div>
    -->
  </div>
</template>
