<script setup lang="ts">
import type { FlowNodePortJSON } from '@nwrx/api'
import type { FlowLink } from '@nwrx/core'

const props = defineProps<{
  id: string
  name: string
  icon: string
  color: string
  data: Record<string, unknown>
  result: Record<string, unknown>
  dataSchema: FlowNodePortJSON[]
  resultSchema: FlowNodePortJSON[]
  position: { x: number; y: number }
  links: FlowLink[]
  zoom: number
  isRunning: boolean
  isSelected: boolean
  isCollapsed: boolean
}>()

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
 * Based on the dataSchema, links and the `isCollapsed` state, compute the
 * data schema that should be displayed in the node. This will be used to
 * render or hide the ports in the node.
 *
 * If the node is collapsed, only the ports that are linked to other nodes
 * will be displayed. If the node is not collapsed, all ports will be displayed.
 */
const dataSchema = computed(() => {
  if (!props.id) return []
  if (!props.dataSchema) return []
  if (!props.links) return props.dataSchema
  if (!isCollapsed.value) return props.dataSchema
  const linkDataIds = new Set(props.links.map(link => link.target))
  return props.dataSchema.filter(port => linkDataIds.has(`${props.id}:${port.key}`))
})

/**
 * Based on the resultSchema, links and the `isCollapsed` state, compute the
 * result schema that should be displayed in the node. This will be used to
 * render or hide the ports in the node.
 *
 * If the node is collapsed, only the ports that are linked to other nodes
 * will be displayed. If the node is not collapsed, all ports will be displayed.
 */
const resultSchema = computed(() => {
  if (!props.id) return []
  if (!props.resultSchema) return []
  if (!props.links) return props.resultSchema
  if (!isCollapsed.value) return props.resultSchema
  const linkResultIds = new Set(props.links.map(link => link.source))
  return props.resultSchema.filter(port => linkResultIds.has(`${props.id}:${port.key}`))
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
    :class="{
      'bg-primary-50/70': isSelected,
      'bg-primary-50/70 ring-primary-100': !isSelected,
      'animate-pulse': isRunning,
    }"
    :style="{
      '--un-ring-color': isSelected && color ? color : undefined,
      '--un-ring-width': zoom ? `${2 / zoom}px` : '1px',
    }"
    class="
      group
      absolute min-h-[80px] w-96
      backdrop-blur-md rounded ring
    "
    @mousedown.stop="(event) => emit('click', event)">

    <!-- Graphflow Node Header -->
    <div
      :class="{
        'text-white': isSelected,
        'bg-primary-100': !isSelected,
      }"
      :style="{
        backgroundColor: isSelected ? `${color}!important` : undefined,
      }"
      class="
        flex justify-start items-center
        h-8 w-full px-2 space-x-2
        rounded-t-md cursor-move
      "
      @mousedown="(event) => emit('handleGrab', event)"
      @mousemove="(event) => emit('handleMove', event)"
      @mouseup="(event) => emit('handleRelease', event)">

      <!-- Circle/icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="w-4 h-4"
        load
      />

      <!-- Title -->
      <p class="font-medium shrink-0">
        {{ name }}
      </p>

      <!-- Debug ID -->
      <p v-if="id" class="text-sm opacity-80 truncate">
        ({{ id.slice(0, 8) }})
      </p>

      <!-- Progress-bar -->
      <div
        v-if="isRunning"
        class=" h-2 w-8 bg-green-500 rounded-full"
      />

      <!-- Run button / play icon -->
      <BaseButton
        eager
        class="
          !ml-auto rounded h-5 w-5
          flex items-center justify-center
          opacity-0
          !hover:opacity-90
          group-hover:opacity-60
          transition-opacity duration-100
          "
        @mousedown.stop
        @click="() => isRunning ? emit('abort') : emit('run')">
        <BaseIcon
          :icon="isRunning ? 'i-carbon:stop' : 'i-carbon:play'"
          class="w-4 h-4 text-white"
        />
      </BaseButton>
    </div>

    <!-- Graphflow Node Body -->
    <div class="flex flex-col py-2 space-y-1">
      <FlowEditorPort
        v-for="port in dataSchema"
        v-bind="port"
        :ref="(component) => portsData[port.key] = component as ComponentPublicInstance"
        :portId="port.key"
        :nodeId="id"
        :value="data?.[port.key]"
        kind="target"
        @setValue="(value) => emit('setDataValue', port.key, value)"
        @grab="(state) => emit('portGrab', state)"
        @assign="(state) => emit('portAssign', state)"
        @release="() => emit('portRelease')"
        @drop="() => emit('portRelease')"
      />
      <FlowEditorPort
        v-for="port in resultSchema"
        v-bind="port"
        :ref="(component) => portsResult[port.key] = component as ComponentPublicInstance"
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
        hover:bg-primary-200
        transition-colors duration-100
        rounded-b-md
      "
      @mousedown.stop="() => isCollapsed = !isCollapsed">
      <BaseIcon
        :icon="isCollapsed ? 'i-carbon:chevron-down' : 'i-carbon:chevron-up'"
        class="w-4 h-4"
        load
      />
    </div>
  </div>
</template>
