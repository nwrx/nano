<script setup lang="ts">
import type { FlowThreadNodeJSON } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'

const props = defineProps<{
  zoom?: number
  isDragging?: boolean
  isSelected?: boolean
  secrets?: string[]
  variables?: string[]
  getOptions?: (key: string, query: string) => Promise<SocketListOption[]>
} & Partial<FlowThreadNodeJSON>>()

const emit = defineEmits<{
  start: []
  abort: []
  click: [event: MouseEvent]
  setInputValue: [key: string, value: unknown]
  getInputOptions: [key: string, query: string]
  linkGrab: [FlowDragState]
  linkAssign: [FlowDragState | void]
  linkRelease: []
  handleGrab: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
}>()

// --- State
const isRunning = computed(() => props.state?.startsWith('RUNNING'))
const isRunningThrottled = refThrottled(isRunning, 300)

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
  isRunningThrottled.value || props.isSelected
    ? props.categoryColor ?? 'transparent'
    : 'transparent'
))

/**
 * Compute the width of the ring based on the node's state and the
 * current zoom level. If the node is running or selected, the ring
 * width will be 3x the default width. Otherwise, it will be 1.25x.
 */
const ringWidth = computed(() => (
  isRunningThrottled.value || props.isSelected
    ? `${3 / (props.zoom ?? 1)}px`
    : `${5 / (props.zoom ?? 1)}px`
))

/**
 * Handle the click event on the  This will emit the `click`
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

    <!-- Header -->
    <EditorNodeHeader
      :text="state"
      :kind="kind"
      :title="label ?? name"
      :icon="icon"
      :description="description"
      :color="isSelected ? categoryColor : `${categoryColor}D0`"
      :is-running="isRunning"
      :is-dragging="isDragging"
      :is-selected="isSelected"
      @start="() => emit('start')"
      @abort="() => emit('abort')"
      @handle-grab="(event) => emit('handleGrab', event)"
      @handle-release="(event) => emit('handleRelease', event)"
    />

    <!-- Graphflow Node Body -->
    <div class="flex flex-col py-sm space-y-xs relative">

      <!-- Error Overlay -->
      <div
        v-if="error"
        class="
          absolute top-0 left-0 right-0 bottom-0
          bg-diagonalstripes-danger-500/60 rd-b
          mask-to-t-0/120 pointer-events-none
        "
      />

      <EditorNodeSocket
        v-for="socket in inputSchema"
        :id="id!"
        :key="socket.key"
        :ref="(component) => socketsData[socket.key] = (component as ComponentPublicInstance)"
        :socket="socket"
        :value="input?.[socket.key]"
        :secrets="secrets"
        :variables="variables"
        :error="inputErrors?.[socket.key]"
        :get-options="getOptions ? (key, query) => getOptions!(socket.key, query) : undefined"
        kind="target"
        @set-value="(value) => emit('setInputValue', socket.key, value)"
        @search-options="(key, query) => emit('getInputOptions', key, query)"
        @grab="(state) => emit('linkGrab', state)"
        @assign="(state) => emit('linkAssign', state)"
        @release="() => emit('linkRelease')"
        @drop="() => emit('linkRelease')"
      />

      <EditorNodeSocket
        v-for="socket in outputSchema"
        :id="id!"
        :key="socket.key"
        :ref="(component) => socketsResult[socket.key] = (component as ComponentPublicInstance)"
        :socket="socket"
        :port-id="socket.key"
        :value="output?.[socket.key]"
        :error="outputErrors?.[socket.key]"
        kind="source"
        @grab="(state) => emit('linkGrab', state)"
        @assign="(state) => emit('linkAssign', state)"
        @release="() => emit('linkRelease')"
        @drop="() => emit('linkRelease')"
      />
    </div>
  </div>
</template>
