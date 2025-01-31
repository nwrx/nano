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

const nodeSelectedId = ref<string | undefined>()
const nodeElements = ref<Record<string, ComponentPublicInstance>>({})
const dragLinkStart = ref<FlowDragState>()
const dragLinkTarget = ref<FlowDragState>()
const mouse = useMouse()

/** Delete the selected node when pressing the `Delete` key. */
onKeyStroke('Delete', () => {
  if (!nodeSelectedId.value) return
  if (document.activeElement instanceof HTMLInputElement) return
  if (document.activeElement instanceof HTMLTextAreaElement) return
  if (document.activeElement instanceof HTMLSelectElement) return
  emit('removeNode', nodeSelectedId.value)
}, { eventName: 'keydown' })

/** Move the selected node using arrow or WASD keys. */
onKeyStroke(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], (event) => {
  if (!nodeSelectedId.value) return
  const node = props.nodes.find(node => node.id === nodeSelectedId.value)
  if (!node) return
  const speed = event.shiftKey ? 100 : 10
  if (event.key === 'ArrowUp') node.position.y -= speed
  if (event.key === 'ArrowDown') node.position.y += speed
  if (event.key === 'ArrowLeft') node.position.x -= speed
  if (event.key === 'ArrowRight') node.position.x += speed
  emit('moveNode', node.id, node.position.x, node.position.y)
}, { eventName: 'keydown' })

/**
 * Watch the local mouse position and emit the `moveMouse` event
 * that allows the parent component to broadcast the mouse position
 * to other clients.
 */
watch([mouse.x, mouse.y], ([x, y]) => emit('moveMouse', x, y))

/**
 * Compute the position of the links between the nodes.
 * The links are computed based on the position of the `pin` elements
 * that are exposed by the Chain.Node component.
 */
const links = computed(() => {
  const links = [] as FlowLinkProps[]
  if (!props.links) return links

  // --- Iterate over the links and compute the position of the source and target pins.
  for (const [from, to] of Object.entries(props.links)) {
    const [source, sourceProperty] = from.split(':')
    const [target, targetProperty] = to.split(':')

    const sourceElement = nodeElements.value[source]
    const targetElement = nodeElements.value[target]
    if (!sourceElement || !targetElement) continue

    // @ts-expect-error: The `portsData` is exposed by the Chain.Node component.
    const sourcePin = sourceElement.portsResult[sourceProperty].pin!
    // @ts-expect-error: The `portsData` is exposed by the Chain.Node component.
    const targetPin = targetElement.portsData[targetProperty].pin!

    const sourceRect = sourcePin.getBoundingClientRect()
    const targetRect = targetPin.getBoundingClientRect()

    links.push({
      sourceX: sourceRect.x + sourceRect.width / 2,
      sourceY: sourceRect.y + sourceRect.height / 2,
      targetX: targetRect.x + targetRect.width / 2,
      targetY: targetRect.y + targetRect.height / 2,
      color: sourcePin.style.backgroundColor,
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
const linkProps = computed((): FlowLinkProps | undefined => {
  if (!dragLinkStart.value) return
  const { position, color, kind = 'data' } = dragLinkStart.value
  return {
    sourceX: kind === 'data' ? mouse.x.value : position.x,
    sourceY: kind === 'data' ? mouse.y.value : position.y,
    targetX: kind === 'data' ? position.x : mouse.x.value,
    targetY: kind === 'data' ? position.y : mouse.y.value,
    color,
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
  if (node.type === 'createNode')
    emit('createNode', node.kind, mouse.x.value, mouse.y.value)
}
</script>

<template>
  <div
    ref="element"
    class="w-full h-full bg-graphpaper-blue-300/50 select-none"
    dropzone="move"
    @drop="(event) => onDrop(event)"
    @dragover.prevent
    @dragenter.prevent
    @mouseup="() => onLinkDrop()"
    @mousedown="() => nodeSelectedId = undefined">

    <!-- Nodes -->
    <FlowEditorNode
      v-for="(node, index) in nodes"
      :id="node.id"
      :ref="(el) => nodeElements[node.id] = el as ComponentPublicInstance"
      :key="index"
      :data="node.data"
      :result="node.result"
      :name="node.name"
      :icon="node.icon"
      :dataSchema="node.dataSchema"
      :resultSchema="node.resultSchema"
      :position="node.position"
      :is-selected="nodeSelectedId === node.id"
      @dragLinkStart="(state) => dragLinkStart = state"
      @dragLinkTarget="(state) => dragLinkTarget = state"
      @dragLinkDrop="() => onLinkDrop()"
      @move="(x, y) => emit('moveNode', node.id, x, y)"
      @select="() => nodeSelectedId = node.id"
      @setDataValue="(portId, value) => emit('setNodeDataValue', node.id, portId, value)"
    />

    <!-- Links -->
    <FlowEditorLink
      v-for="(link, index) in links"
      :key="index"
      v-bind="link"
    />

    <!-- Link used to drag from one node to another. -->
    <FlowEditorLink
      v-if="linkProps"
      v-bind="linkProps"
    />
  </div>
</template>
