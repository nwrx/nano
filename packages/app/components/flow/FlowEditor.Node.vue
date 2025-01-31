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

/**
 * The `isCollapsed` state is used to determine if the node should be
 * displayed in a collapsed state or not. This state is two-way binded
 * to the parent component.
 */
const isCollapsed = ref(false)
watch(isCollapsed, value => emit('setCollapsed', value))

/**
 * A debounced `isRunning` state so when a node runs fast, it doesn't
 * flash the running state. This is used to determine if the node is
 * currently running or not.
 */
const isRunning = computed(() => props.isRunning)
const isRunningThrottled = refThrottled(isRunning, 200)

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

const socketsData = ref<Record<string, ComponentPublicInstance>>({})
const socketsResult = ref<Record<string, ComponentPublicInstance>>({})

/**
 * Expose the ports components to the parent component so their
 * position can be accessed and used to create links between nodes.
 */
defineExpose({ socketsData, socketsResult })

/**
 * Compute the ring color based on the node's state. If the node is
 * selected or running, the ring will be colored. Otherwise, it will
 * be transparent.
 */
const ringColor = computed(() => (
  isRunningThrottled.value || props.isSelected
    ? props.color
    : 'transparent'
))

/**
 * Compute the width of the ring based on the node's state and the
 * current zoom level. If the node is running or selected, the ring
 * width will be 3x the default width. Otherwise, it will be 1.25x.
 */
const ringWidth = computed(() => (
  isRunningThrottled.value || props.isSelected
    ? `${3 / props.zoom}px`
    : `${1.25 / props.zoom}px`
))
</script>

<template>
  <div
    :style="{
      '--un-ring-color': ringColor,
      '--un-ring-width': ringWidth,
    }"
    class="
      min-h-24 w-96 relative
      backdrop-blur-2xl rounded ring
      bg-editor-node border border-editor
    "
    @mousedown.stop="(event) => emit('click', event)">

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
      :name="name"
      :icon="icon"
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
    <div class="flex flex-col py-sm space-y-sm">
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
  </div>
</template>
