<script setup lang="ts">
import type { FlowSchemaJSON } from '@nanoworks/core'

const props = defineProps<{
  isSelected: boolean
  id: string
  name: string
  icon?: string
  data: Record<string, unknown>
  result: Record<string, unknown>
  dataSchema: FlowSchemaJSON
  resultSchema: FlowSchemaJSON
  position: { x: number; y: number }
}>()

const emit = defineEmits<{
  select: []
  move: [x: number, y: number]
  dragLinkStart: [FlowDragState | undefined]
  dragLinkTarget: [FlowDragState | undefined]
  dragLinkDrop: []
  setDataValue: [portId: string, value: unknown]
}>()

const element = ref<HTMLDivElement>()
const handle = ref<HTMLDivElement>()
const portsData = ref<Record<string, ComponentPublicInstance>>({})
const portsResult = ref<Record<string, ComponentPublicInstance>>({})

/**
 * Expose the ports components to the parent component so their
 * position can be accessed and used to create links between nodes.
 */
defineExpose({ portsData, portsResult })

/** Allow the node to be dragged around the screen. */
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const { x, y, style } = useDraggable(element, {
  initialValue: { x: props.position.x, y: props.position.y },
  onMove: ({ x, y }) => emit('move', x, y),
  onStart: () => emit('select'),
  preventDefault: true,
  handle,
})

/** Watch the `position` prop to update the draggable state. */
watch(() => props.position, (position) => {
  x.value = position.x
  y.value = position.y
})
</script>

<template>
  <div
    ref="element"
    :style="style"
    :class="{
      'border-primary-600': isSelected,
      'border-primary-200': !isSelected,
    }"
    class="
      absolute min-h-[80px] w-[350px] pb-[20px]
      backdrop-blur-sm cursor-pointer
      rounded-md bg-primary-100/80 border-1
      transition-colors duration-100
    "
    @mousedown.stop="() => emit('select')">

    <!-- Graphflow Node Header -->
    <div
      ref="handle"
      class="
        flex justify-start items-center
        h-8 w-full px-2 space-x-2
        rounded-t-md
        cursor-move bg-primary-200/80
      ">

      <!-- Circle/icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="w-4 h-4"
        load
      />

      <!-- Title -->
      <p class="font-black">
        {{ name }}
      </p>

      <!-- Progress-bar -->
      <div class="!ml-auto h-2 w-8 bg-green-500 rounded-full"></div>
    </div>

    <!-- Graphflow Node Body -->
    <div class="flex flex-col py-2">
      <FlowEditorPort
        v-for="(port, portId) in dataSchema"
        :key="portId"
        :ref="(component: ComponentPublicInstance) => portsData[portId] = component"
        :port="port"
        :portId="portId"
        :nodeId="id"
        :value="data[portId]"
        kind="data"
        @dragLinkStart="(state: FlowDragState) => emit('dragLinkStart', state)"
        @dragLinkTarget="(state: FlowDragState) => emit('dragLinkTarget', state)"
        @dragLinkDrop="() => emit('dragLinkDrop')"
        @setValue="(value: unknown) => emit('setDataValue', portId, value)"
      />
      <FlowEditorPort
        v-for="(port, portId) in resultSchema"
        :key="portId"
        :ref="(component: ComponentPublicInstance) => portsResult[portId] = component"
        :port="port"
        :portId="portId"
        :nodeId="id"
        :value="result[portId]"
        kind="result"
        @dragLinkStart="(state: FlowDragState) => emit('dragLinkStart', state)"
        @dragLinkTarget="(state: FlowDragState) => emit('dragLinkTarget', state)"
        @dragLinkDrop="() => emit('dragLinkDrop')"
      />
    </div>
  </div>
</template>
