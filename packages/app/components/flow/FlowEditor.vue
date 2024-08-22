<script setup lang="ts">
import type { FlowNodeInstanceJSON } from '@nanoworks/core'
import type { DropPayload } from '~/utils/types'

const props = defineProps<{
  nodes: FlowNodeInstanceJSON[]
  links: Record<string, string>
}>()

const emit = defineEmits<{
  createNode: [kind: string, x: number, y: number]
  createLink: [source: string, target: string]
  removeLink: [source: string]
  removeNode: [nodeId: string]
  moveNode: [nodeId: string, x: number, y: number]
  moveMouse: [x: number, y: number]
  setNodeDataValue: [nodeId: string, portId: string, value: unknown]
}>()

const editor = ref<HTMLElement>()
const nodeSelectedId = ref<string | undefined>()

/** Delete the selected node when pressing the `Delete` key. */
onKeyStroke('Delete', (event) => {
  event.preventDefault()
  if (!nodeSelectedId.value) return
  if (document.activeElement instanceof HTMLInputElement) return
  if (document.activeElement instanceof HTMLTextAreaElement) return
  if (document.activeElement instanceof HTMLSelectElement) return
  emit('removeNode', nodeSelectedId.value)
}, { eventName: 'keydown' })

/** Move the selected node using arrow or WASD keys. */
onKeyStroke(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], (event) => {
  event.preventDefault()
  if (!nodeSelectedId.value) return
  const node = props.nodes.find(node => node.id === nodeSelectedId.value)
  if (!node) return
  const speed = event.shiftKey ? 100 : 10
  const position = { ...node.position }
  if (event.key === 'ArrowUp') position.y -= speed
  if (event.key === 'ArrowDown') position.y += speed
  if (event.key === 'ArrowLeft') position.x -= speed
  if (event.key === 'ArrowRight') position.x += speed
  emit('moveNode', node.id, position.x, position.y)
}, { eventName: 'keydown' })

/**
 * Watch the local mouse position and emit the `moveMouse` event
 * that allows the parent component to broadcast the mouse position
 * to other clients.
 */
const mouse = useMouse()
watch([mouse.x, mouse.y], ([x, y]) => emit('moveMouse', x, y))

/**
 * Compute the position of the links between the nodes.
 * The links are computed based on the position of the `pin` elements
 * that are exposed by the Chain.Node component.
 */
const nodeElements = ref<Record<string, ComponentPublicInstance>>({})
const linkNodes = computed(() => {
  const links = [] as FlowLinkProps[]
  if (!props.links) return links
  if (!editor.value) return links
  const { left, top } = editor.value.getBoundingClientRect()

  // --- Iterate over the links and compute the position of the source and target pins.
  for (const [from, to] of Object.entries(props.links)) {
    const [source, sourceProperty] = from.split(':')
    const [target, targetProperty] = to.split(':')

    // --- Get the source and target node elements.
    const sourceNodeElement = nodeElements.value[source]
    const targetNodeElement = nodeElements.value[target]
    if (!sourceNodeElement || !targetNodeElement) continue

    // --- Get the source and target pin elements.
    // @ts-expect-error: The `portsData` is exposed by the Chain.Node component.
    const sourcePin = sourceNodeElement.portsResult[sourceProperty]?.pin
    // @ts-expect-error: The `portsData` is exposed by the Chain.Node component.
    const targetPin = targetNodeElement.portsData[targetProperty]?.pin
    if (!sourcePin || !targetPin) continue

    // --- Compute the position of the source and target pins.
    const sourceRect = sourcePin.getBoundingClientRect()
    const targetRect = targetPin.getBoundingClientRect()

    // --- Push the computed link to the links array.
    links.push({
      sourceX: (sourceRect.x + sourceRect.width / 2) - left,
      sourceY: (sourceRect.y + sourceRect.height / 2) - top,
      targetX: (targetRect.x + targetRect.width / 2) - left,
      targetY: (targetRect.y + targetRect.height / 2) - top,
      sourceColor: sourcePin.style.backgroundColor,
      targetColor: targetPin.style.backgroundColor,
    })
  }

  // --- Return the computed links.
  return links
})

/**
 * Compute the link that is being dragged from one node to another.
 * This link is computed based on the position of the mouse and the node
 * that is being dragged from.
 */
const dragLinkStart = ref<FlowDragState>()
const dragLinkTarget = ref<FlowDragState>()
const linkDrag = computed((): FlowLinkProps | undefined => {
  if (!editor.value) return
  if (!dragLinkStart.value) return
  const { left, top } = editor.value.getBoundingClientRect()
  const { position, color, kind = 'data' } = dragLinkStart.value
  return {
    sourceX: (kind === 'data' ? mouse.x.value : position.x) - left,
    sourceY: (kind === 'data' ? mouse.y.value : position.y) - top,
    targetX: (kind === 'data' ? position.x : mouse.x.value) - left,
    targetY: (kind === 'data' ? position.y : mouse.y.value) - top,
    sourceColor: color,
    targetColor: color,
  }
})

/**
 * When dropping a link, emit the `nodeLink` event trigger the parent
 * component to link the two nodes together and broadcast the new link.
 */
function onLinkDrop() {
  const source = dragLinkStart.value
  const target = dragLinkTarget.value
  dragLinkStart.value = undefined
  dragLinkTarget.value = undefined
  if (!source) return
  else if (!target) emit('removeLink', source.id)
  else if (target && target.kind === 'data') emit('createLink', source.id, target.id)
  else if (target && target.kind === 'result') emit('createLink', target.id, source.id)
}

/**
 * When dropping an `application/json` file, emit the `createNode` event
 * to trigger the parent component to create a new node based on the
 * dropped JSON data.
 *
 * @param event The drop event that contains the JSON data.
 */
function onDrop(event: DragEvent) {
  if (!event.dataTransfer) return
  const data = event.dataTransfer.getData('application/json')
  if (!data) return
  const node = JSON.parse(data) as DropPayload

  if (node.type === 'createNode') {
    if (!editor.value) return
    const { left, top } = editor.value.getBoundingClientRect()
    emit('createNode', node.kind, mouse.x.value - left, mouse.y.value - top)
  }
}

/**
 * Each time a node is selected, update it's z-index to make it appear
 * on top of the other nodes. This is done by using a counter that is
 * incremented each time a node is selected.
 */
const zIndexCounter = ref(0)
const zIndexMap = reactive<Record<string, number>>({})
watch(nodeSelectedId, () => {
  if (!nodeSelectedId.value) return
  zIndexMap[nodeSelectedId.value] = zIndexCounter.value++
})
</script>

<template>
  <div
    ref="editor"
    class="w-full h-full bg-graphpaper-blue-300/50 select-none"
    dropzone="move"
    @drop="(event) => onDrop(event)"
    @dragover.prevent
    @dragenter.prevent
    @mouseup="() => onLinkDrop()"
    @mousedown="() => nodeSelectedId = undefined">

    <pre class="absolute pointer-events-none">{{ links }}</pre>

    <!-- Nodes -->
    <FlowEditorNode
      v-for="(node, index) in nodes"
      :id="node.id"
      :ref="(el) => nodeElements[node.id] = el as ComponentPublicInstance"
      :key="index"
      :data="node.data"
      :result="node.result"
      :name="node.name ?? node.kind"
      :icon="node.icon"
      :dataSchema="node.dataSchema"
      :resultSchema="node.resultSchema"
      :position="node.position"
      :is-selected="nodeSelectedId === node.id"
      :style="{
        'transform': `translate(${node.position.x}px, ${node.position.y}px)`,
        'z-index': zIndexMap[node.id] ?? 0,
      }"
      :links="links"
      @select="() => nodeSelectedId = node.id"
      @move="(x, y) => emit('moveNode', node.id, x, y)"
      @setDataValue="(portId, value) => emit('setNodeDataValue', node.id, portId, value)"
      @dragLinkStart="(state) => dragLinkStart = state"
      @dragLinkTarget="(state) => dragLinkTarget = state"
      @dragLinkDrop="() => onLinkDrop()"
    />

    <!-- Links -->
    <FlowEditorLink
      v-for="(link, index) in linkNodes"
      :key="index"
      :source-x="link.sourceX"
      :source-y="link.sourceY"
      :source-color="link.sourceColor"
      :target-x="link.targetX"
      :target-y="link.targetY"
      :target-color="link.targetColor"
    />

    <!-- Link used to drag from one node to another. -->
    <FlowEditorLink
      v-if="linkDrag"
      :source-x="linkDrag.sourceX"
      :source-y="linkDrag.sourceY"
      :source-color="linkDrag.sourceColor"
      :target-x="linkDrag.targetX"
      :target-y="linkDrag.targetY"
      :target-color="linkDrag.targetColor"
    />
  </div>
</template>
