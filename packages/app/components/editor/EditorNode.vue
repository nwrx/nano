<script setup lang="ts">
import type { ComponentInstanceJSON } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'
import type { FlowLinkSocket } from '~/composables/useFlowEditorView'

const props = defineProps<{
  zoom?: number
  isDragging?: boolean
  isSelected?: boolean
  secrets?: string[]
  variables?: string[]
  getOptions?: (key: string, query: string) => Promise<SocketListOption[]>
} & ComponentInstanceJSON>()

const emit = defineEmits<{
  start: []
  abort: []
  click: [event: MouseEvent]
  setInputValue: [key: string, value: unknown]
  getInputOptions: [key: string, query: string]
  handleGrab: [event: MouseEvent]
  handleRelease: [event: MouseEvent]
  linkGrab: [FlowLinkSocket]
  linkAssign: [FlowLinkSocket]
  linkUnassign: []
}>()

const isRunning = computed(() => props.state.startsWith('RUNNING'))
const isRunningThrottled = refThrottled(isRunning, 300)

const ringColor = computed(() => (
  isRunningThrottled.value || props.isSelected
    ? props.categoryColor ?? 'transparent'
    : 'transparent'
))

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
        :id="id"
        :key="socket.key"
        :socket="socket"
        :value="input[socket.key]"
        :secrets="secrets"
        :variables="variables"
        :get-options="getOptions ? (key, query) => getOptions!(socket.key, query) : undefined"
        @set-value="(value) => emit('setInputValue', socket.key, value)"
        @search-options="(key, query) => emit('getInputOptions', key, query)"
        @link-grab="(path) => emit('linkGrab', { id, name: socket.key, path })"
        @link-assign="(path) => emit('linkAssign', { id, name: socket.key, path })"
        @link-unassign="() => emit('linkUnassign')"
      />

      <EditorNodeSocket
        v-for="socket in outputSchema"
        :id="id"
        :key="socket.key"
        :socket="socket"
        :port-id="socket.key"
        :value="output[socket.key]"
        :is-output="true"
        @link-grab="(path) => emit('linkGrab', { id, name: socket.key, path, isOutput: true })"
        @link-assign="(path) => emit('linkAssign', { id, name: socket.key, path, isOutput: true })"
        @link-unassign="() => emit('linkUnassign')"
      />
    </div>
  </div>
</template>
