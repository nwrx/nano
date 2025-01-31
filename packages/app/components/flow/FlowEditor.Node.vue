<script setup lang="ts">
import type { FlowSchemaJSON } from '@nanoworks/core'

const props = defineProps<{
  isSelected?: boolean
  id?: string
  name?: string
  icon?: string
  data?: Record<string, unknown>
  result?: Record<string, unknown>
  dataSchema?: FlowSchemaJSON
  resultSchema?: FlowSchemaJSON
  position?: { x: number; y: number }
  isCollapsed?: boolean
  links?: Record<string, string>
}>()

const emit = defineEmits<{
  select: []
  move: [x: number, y: number]
  setDataValue: [portId: string, value: unknown]
  dragLinkStart: [FlowDragState | undefined]
  dragLinkTarget: [FlowDragState | undefined]
  dragLinkDrop: []
  setCollapsed: [value: boolean]
}>()

/**
 * The `isCollapsed` state is used to determine if the node should be
 * displayed in a collapsed state or not. This state is two-way binded
 * to the parent component.
 */
const isCollapsed = useVModel(props, 'isCollapsed', emit, {
  passive: true,
  eventName: 'setCollapsed',
})

/**
 * Based on the dataSchema, links and the `isCollapsed` state, compute the
 * data schema that should be displayed in the node. This will be used to
 * render or hide the ports in the node.
 *
 * If the node is collapsed, only the ports that are linked to other nodes
 * will be displayed. If the node is not collapsed, all ports will be displayed.
 */
const dataSchema = computed(() => {
  if (!isCollapsed.value) return props.dataSchema
  const dataSchema: FlowSchemaJSON = {}
  const linkValues = Object.values(props.links ?? {})

  for (const [portId, port] of Object.entries(props.dataSchema ?? {}))
    if (linkValues.includes(portId)) dataSchema[portId] = port
  return dataSchema
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
  if (!isCollapsed.value) return props.resultSchema
  const resultSchema: FlowSchemaJSON = {}
  const linkKeys = Object.keys(props.links ?? {})
  for (const [portId, port] of Object.entries(props.resultSchema ?? {}))
    if (linkKeys.includes(portId)) resultSchema[portId] = port
  return resultSchema
})

const portsData = ref<Record<string, ComponentPublicInstance>>({})
const portsResult = ref<Record<string, ComponentPublicInstance>>({})

/**
 * Expose the ports components to the parent component so their
 * position can be accessed and used to create links between nodes.
 */
defineExpose({ portsData, portsResult })

const { x, y } = useMouse()
const isDragging = ref(false)
const dragOrigin = ref({ x: 0, y: 0 })
const dragFrom = ref({ x: 0, y: 0 })

watch([x, y], ([x, y]) => {
  if (!isDragging.value) return
  const newX = dragFrom.value.x + (x - dragOrigin.value.x)
  const newY = dragFrom.value.y + (y - dragOrigin.value.y)
  emit('move', newX, newY)

})

/**
 * Handle the start of the drag event. When triggered, it will set the
 * dragging state to true and store the origin and current position of
 * the node.
 */
function handleDragStart() {
  if (!props.position) return
  isDragging.value = true
  dragOrigin.value = { x: x.value, y: y.value }
  dragFrom.value = { x: props.position.x, y: props.position.y }
}

/**
 * Handle the end of the drag event. When triggered, will set the dragging
 * state to false.
 */
function handleDragStop() {
  isDragging.value = false
}
</script>

<template>
  <div
    :class="{
      'border-primary-600': isSelected,
      'border-primary-200': !isSelected,
    }"
    class="
      absolute min-h-[80px] w-[350px]
      backdrop-blur-sm cursor-pointer
      rounded-md bg-primary-100/80 border-1
      transition-colors duration-100
    "
    @mousedown.stop="() => emit('select')">

    <!-- Graphflow Node Header -->
    <div
      class="
        flex justify-start items-center
        h-8 w-full px-2 space-x-2
        rounded-t-md
        cursor-move bg-primary-200/80
      "
      @mouseup="() => handleDragStop()"
      @mousedown="() => handleDragStart()">

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
        :value="data?.[portId]"
        :value-is-dynamic="false"
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
        :value="result?.[portId]"
        :value-is-dynamic="false"
        kind="result"
        @dragLinkStart="(state: FlowDragState) => emit('dragLinkStart', state)"
        @dragLinkTarget="(state: FlowDragState) => emit('dragLinkTarget', state)"
        @dragLinkDrop="() => emit('dragLinkDrop')"
      />
    </div>

    <!-- Collapse bar -->
    <div
      class="
        flex justify-center items-center
        h-8 w-full cursor-pointer
        hover:bg-primary-200
        transition-colors duration-100
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
