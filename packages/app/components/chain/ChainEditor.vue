<script setup lang="ts">
import type { ChainNodeObject } from '@hsjm/oblisk-core'

const props = defineProps<{
  nodes: ChainNodeObject[]
  links: Record<string, string>
}>()

const emit = defineEmits<{
  createLink: [source: string, target: string]
  removeLink: [source: string]
  updateNodePosition: [nodeId: string, x: number, y: number]
  moveMouse: [x: number, y: number]
}>()

const nodeElements = ref<Record<string, ComponentPublicInstance>>({})
const dragSource = ref<ChainDragState>()
const dragTarget = ref<ChainDragState>()
const mouse = useMouse()

const nodeSelectedId = ref<string | undefined>()
const nodeSelected = computed(() => props.nodes.find(node => node.id === nodeSelectedId.value))

/**
 * Compute the position of the links between the nodes.
 * The links are computed based on the position of the `pin` elements
 * that are exposed by the Chain.Node component.
 */
const links = computed(() => {
  const links = [] as ChainLinkProps[]
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
const linkProps = computed((): ChainLinkProps | undefined => {
  if (!dragSource.value) return
  const { position, color, kind = 'data' } = dragSource.value
  return {
    sourceX: kind === 'data' ? mouse.x.value : position.x,
    sourceY: kind === 'data' ? mouse.y.value : position.y,
    targetX: kind === 'data' ? position.x : mouse.x.value,
    targetY: kind === 'data' ? position.y : mouse.y.value,
    color,
  }
})

/**
 * Watch the local mouse position and emit the `moveMouse` event
 * that allows the parent component to broadcast the mouse position
 * to other clients.
 */
watch([mouse.x, mouse.y], ([x, y]) => emit('moveMouse', x, y))

/**
 * When dropping a link, emit the `nodeLink` event trigger the parent
 * component to link the two nodes together and broadcast the new link.
 */
function onDragDrop() {
  const source = dragSource.value
  const target = dragTarget.value
  dragSource.value = undefined
  dragTarget.value = undefined
  if (!source) return
  else if (!target) emit('removeLink', source.id)
  else if (target && target.kind === 'data') emit('createLink', source.id, target.id)
  else if (target && target.kind === 'result') emit('createLink', target.id, source.id)
}
</script>

<template>
  <div
    ref="element"
    @mouseup="() => onDragDrop()"
    @mousedown="() => nodeSelectedId = undefined"
    class="w-full h-full bg-graphpaper-blue-300/50 select-none">

    <!-- Nodes -->
    <ChainEditorNode
      v-for="(node, index) in nodes"
      :ref="(el) => nodeElements[node.id] = el as ComponentPublicInstance"
      :key="index"
      :id="node.id"
      :icon="node.icon"
      :label="node.label"
      :position="node.position"
      :data-schema="node.dataSchema"
      :result-schema="node.resultSchema"
      :is-selected="nodeSelectedId === node.id"
      @dragSource="(state) => dragSource = state"
      @dragTarget="(state) => dragTarget = state"
      @dragDrop="() => onDragDrop()"
      @move="(x, y) => emit('updateNodePosition', node.id, x, y)"
      @select="() => nodeSelectedId = node.id"
    />

    <!--
      <pre
      class="absolute top-0 left-0 p-4 text-xs text-white bg-black bg-opacity-50 pointer-events-none"
      v-text="nodeSelected"
      />
    -->

    <!-- Links -->
    <ChainEditorLink
      v-for="(link, index) in links"
      :key="index"
      v-bind="link"
    />

    <!-- Link used to drag from one node to another. -->
    <ChainEditorLink
      v-if="linkProps"
      v-bind="linkProps"
    />
  </div>
</template>
