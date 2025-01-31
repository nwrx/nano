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
  run: []
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

const portsData = ref<Record<string, ComponentPublicInstance>>({})
const portsResult = ref<Record<string, ComponentPublicInstance>>({})

/**
 * Expose the ports components to the parent component so their
 * position can be accessed and used to create links between nodes.
 */
defineExpose({ portsData, portsResult })
</script>

<template>
  <div
    :style="{
      '--un-ring-color': (isRunningThrottled || isSelected) && color ? color : `transparent`,
      '--un-ring-width': (isRunningThrottled || isSelected) ? `${3 / zoom}px` : `${1.25 / zoom}px`,
    }"
    class="
      absolute min-h-24 w-96 bg-editor-node border border-editor
      backdrop-blur-2xl rounded ring
    "
    @mousedown.stop="(event) => emit('click', event)">

    <FlowEditorNodeHeader
      :id="id"
      :name="name"
      :icon="icon"
      :color="isSelected ? color : `${color}D0`"
      :isRunning="isRunning"
      :isDragging="isDragging"
      :isSelected="isSelected"
      @run="() => emit('run')"
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
        :ref="(component) => portsData[port.key] = (component as ComponentPublicInstance)"
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
        :ref="(component) => portsResult[port.key] = (component as ComponentPublicInstance)"
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

    <!-- Error message -->
    <div v-if="error" class="absolute w-full mt-2">
      <div class="bg-danger-100 text-danger-500 border border-danger-500 p-1 text-xs rounded">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>
