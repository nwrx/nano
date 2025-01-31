/* eslint-disable unicorn/prevent-abbreviations */
import type { FlowSessionParticipantJSON, NodeInstanceJSON } from '@nwrx/api'
import type { Position } from '@vueuse/core'
import type { FlowEditorNode } from '#build/components'
import type { CSSProperties } from 'vue'

export interface UseFlowEditorOptions {

  /**
   * The ID of the current user that is connected to the flow session.
   */
  peerId: Ref<string>

  /**
   * The list of users that are currently connected to the flow session.
   *
   * @default []
   */
  peers: Ref<FlowSessionParticipantJSON[]>

  /**
   * The list of nodes instances that are currently in the flow editor.
   *
   * @default []
   */
  nodes: Ref<NodeInstanceJSON[]>

  /**
   * The size of the viewplane. This is used to determine the size of internal
   * elements that contains the nodes and links.
   *
   * @default 1000
   */
  viewSize: number

  /**
   * The function to call when a new node is created in the flow editor.
   *
   * @param node The node that was created.
   */
  onNodeCreate?: (kind: string, x: number, y: number) => void

  /**
   * The function to call when one or multiple nodes are duplicated in the flow editor.
   *
   * @param nodeIds The list of node IDs that were duplicated.
   */
  onNodeDuplicate?: (nodeId: string, x: number, y: number) => void

  /**
   * The function to call when the node selection changes in the flow editor.
   *
   * @param nodes The list of selected nodes in the flow editor.
   */
  onNodesSelect?: (nodes: NodeInstanceJSON[]) => void

  /**
   * The function to call when one or more nodes are moved in the flow editor.
   *
   * @param nodes The list of nodes that were moved and their new positions.
   */
  onNodesMove?: (nodes: FlowNodePosition[]) => void

  /**
   * The function to call when a node is removed from the flow editor.
   *
   * @param id The ID of the node that was removed.
   */
  onNodesRemove?: (ids: string[]) => void

  /**
   * The function to call when a link is dropped on the flow editor.
   *
   * @param source The source node of the link.
   * @param target The target node of the link.
   */
  onLinkCreate?: (source: string, target: string) => void

  /**
   * The function to call when a link is removed from the flow editor.
   *
   * @param source The source node of the link.
   */
  onLinkRemove?: (source: string) => void

  /**
   * The function to call when the current user moves in the flow editor.
   *
   * @param x The x position of the user.
   * @param y The y position of the user.
   */
  onUserSetPosition?: (x: number, y: number) => void
}

/**
 * The `useFlowEditor` composable provides the logic to interact with the flow editor.
 * This includes the ability to move the viewplane, zoom in and out and create new nodes.
 * The composable is used in the `FlowEditor` component to provide the logic to interact
 * with the flow editor.
 *
 * @param options The options to configure the flow editor.
 * @returns The reactive state and methods to interact with the flow editor.
 */
export function useFlowEditor(options: UseFlowEditorOptions) {
  const {
    peerId,
    peers,
    nodes,
    viewSize = 1000,
    onNodeCreate = () => {},
    onNodeDuplicate = () => {},
    onNodesSelect = () => {},
    onNodesMove = () => {},
    onNodesRemove = () => {},
    onLinkCreate = () => {},
    onLinkRemove = () => {},
    onUserSetPosition = () => {},
  } = options

  // --- Initialize the view state.
  const view = ref<HTMLDivElement>()
  const viewContainer = ref<HTMLDivElement>()
  const viewContainerRectRefs = useElementBounding(viewContainer, { immediate: true })
  const viewContainerRect = toReactive(viewContainerRectRefs)
  const viewPosition = ref({ x: 0, y: 0 })
  const viewZoom = ref(1)
  const viewMoving = ref(false)
  const viewDragOriginScreen = ref({ x: 0, y: 0 })
  const viewDragOriginWorld = ref({ x: 0, y: 0 })
  const viewSelecting = ref(false)
  const viewSelectFrom = ref({ x: 0, y: 0 })
  const viewSelectTo = ref({ x: 0, y: 0 })

  // --- Initialize the cursor state.
  const cursorView = ref({ x: 0, y: 0 })
  const cursorWorld = ref({ x: 0, y: 0 })
  const cursorPeers = computed(() => peers.value.filter(peer => peer.id !== peerId.value))

  // --- Initialize the node state.
  const nodeComponents = ref<Record<string, ComponentPublicInstance>>({})
  const nodeDragging = ref(false)
  const nodeDragOriginWorld = ref<Record<string, Position>>({})
  const nodeDragOriginScreen = ref({ x: 0, y: 0 })
  const nodeSelectedIds = ref(new Set<string>())
  const nodeSelected = computed(() => nodes.value.filter(node => nodeSelectedIds.value.has(node.id)))
  watch(nodeSelected, onNodesSelect)

  // --- Handle the z-index of the nodes. Each time a node is clicked, the z-index
  // --- is increased to bring the node to the front. This is done by incrementing
  // --- the `zIndexCounter` and storing the z-index in the `zIndexMap`.
  const zIndexCounter = ref(0)
  const zIndexMap = reactive<Record<string, number>>({})
  watch(nodeSelectedIds, () => {
    for (const id of nodeSelectedIds.value)
      zIndexMap[id] = zIndexCounter.value++
  }, { deep: true })

  // --- Initialize the drag link state.
  const linksProps = ref<FlowLinkProps[]>([])
  const linkDragFrom = ref<FlowDragState>()
  const linkDragTo = ref<FlowDragState | void>()
  const linkDragProps = ref<FlowLinkProps>()

  ////////////////////////////

  // --- Compute the position of the cursor in the world coordinates.
  function screenToWorld(position: Position) {
    const { x: xContainer, y: yContainer, width, height } = viewContainerRect
    return {
      x: Math.round((position.x - xContainer - (viewPosition.value.x * viewZoom.value) - width / 2) / viewZoom.value),
      y: Math.round((position.y - yContainer - (viewPosition.value.y * viewZoom.value) - height / 2) / viewZoom.value),
    }
  }

  // --- Compute the position of the cursor in the view coordinates.
  function worldToView(position: Position) {
    return {
      x: Math.round(position.x + (viewSize / 2)),
      y: Math.round(position.y + (viewSize / 2)),
    }
  }

  // --- Compute the position of the cursor in the view coordinates
  function screenToView(position: Position) {
    const world = screenToWorld(position)
    return worldToView(world)
  }

  // --- Compute the position of the cursor in the screen coordinates.
  function setLinkProps() {
    setTimeout(() => {
      const result = [] as FlowLinkProps[]

      // --- Iterate over the links and compute the position of the source and target pins.
      for (const node of nodes.value) {
        for (const key in node.data) {
          const value = node.data[key]
          if (typeof value !== 'string') continue
          if (!value.startsWith('$NODE.')) continue

          // --- Get the source and target node IDs.
          const [source, sourceProperty] = value.slice(6).split(':')
          const [target, targetProperty] = [node.id, key]

          // --- Get the source and target node elements.
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          const sourceNodeComponent = nodeComponents.value[source] as unknown as typeof FlowEditorNode
          const targetNodeComponent = nodeComponents.value[target] as unknown as typeof FlowEditorNode
          if (!sourceNodeComponent || !targetNodeComponent) continue

          // --- Get the source and target pin elements.
          const sourceElement = sourceNodeComponent.portsResult[sourceProperty]?.pin as HTMLElement
          const targetElement = targetNodeComponent.portsData[targetProperty]?.pin as HTMLElement
          if (!sourceElement || !targetElement) continue
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
          /* eslint-enable @typescript-eslint/no-unsafe-assignment */

          // --- Get the source and target pin rectangles.
          const sourceRect = sourceElement.getBoundingClientRect()
          const targetRect = targetElement.getBoundingClientRect()

          const sourcePosition = screenToView({
            x: sourceRect.x + sourceRect.width / 2,
            y: sourceRect.y + sourceRect.height / 2,
          })

          const targetPosition = screenToView({
            x: targetRect.x + targetRect.width / 2,
            y: targetRect.y + targetRect.height / 2,
          })

          // --- Push the computed link to the links array.
          result.push({
            sourceX: sourcePosition.x,
            sourceY: sourcePosition.y,
            targetX: targetPosition.x,
            targetY: targetPosition.y,
            sourceColor: sourceElement.style.backgroundColor,
            targetColor: targetElement.style.backgroundColor,
          })
        }
      }

      // --- Return the computed links.
      linksProps.value = result
    }, 1)
  }

  // --- Watch the links and update the link properties when the links change.
  watch([nodes, viewZoom], setLinkProps, { immediate: true, deep: true })

  ////////////////////////////

  return toReactive({
    view,
    viewContainer,
    viewPosition,
    viewZoom,
    viewMoving,
    viewDragOriginScreen,
    viewDragOriginWorld,
    viewSelecting,
    cursorView,
    cursorWorld,
    cursorPeers,
    nodeSelectedIds,
    nodeSelected,
    nodeComponents,
    nodeDragging,
    nodeDragOriginScreen,
    nodeDragOriginWorld,
    linksProps,
    linkDragFrom,
    linkDragTo,

    ////////////////////////////

    /**
     * The style of the editor element that contains the viewplane.
     */
    viewContainerStyle: computed<CSSProperties>(() => ({
      cursor: viewMoving.value ? 'grabbing' : 'auto',
    })),

    /**
     * The style of the viewplane element that contains the nodes and links.
     */
    viewStyle: computed<CSSProperties>(() => {

      // --- Compute the position of the viewplane based on the view position and the zoom level.
      const { width, height } = viewContainerRect
      const viewX = (viewPosition.value.x * viewZoom.value) + (width / 2) - (viewSize / 2)
      const viewY = (viewPosition.value.y * viewZoom.value) + (height / 2) - (viewSize / 2)

      // --- Return the style object that should be applied to the viewplane.
      return {
        position: 'absolute',
        left: `${viewX}px`,
        top: `${viewY}px`,
        transform: `scale(${viewZoom.value})`,
        width: `${viewSize}px`,
        height: `${viewSize}px`,
      }
    }),

    /**
     * The style of the selection box that is drawn when selecting multiple nodes.
     */
    viewSelectorStyle: computed<CSSProperties>(() => {
      if (!viewSelecting.value) return {}
      const { x, y } = viewContainerRect
      const from = { x: viewSelectFrom.value.x - x, y: viewSelectFrom.value.y - y }
      const to = { x: viewSelectTo.value.x - x, y: viewSelectTo.value.y - y }
      return {
        position: 'absolute',
        left: `${Math.min(from.x, to.x)}px`,
        top: `${Math.min(from.y, to.y)}px`,
        width: `${Math.abs(from.x - to.x)}px`,
        height: `${Math.abs(from.y - to.y)}px`,
        pointerEvents: 'none',
      }
    }),

    /**
     * Resolve the style of the node based on the position and the local z-index map.
     *
     * @param node The node that should be styled.
     * @returns The style object that should be applied to the node.
     */
    getNodeStyle: (node: NodeInstanceJSON): CSSProperties => {
      const { x, y } = worldToView(node.position)
      const isSelected = nodeSelectedIds.value.has(node.id)
      return {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: zIndexMap[node.id] ?? 1,
        transition: isSelected ? 'none' : 'all 0.1s ease',
      }
    },

    /**
     * Resolve the style of a peer based on it's position and color. The peer
     * is styled as a small circle that is positioned on the viewplane.
     *
     * @param peer The peer that should be styled.
     * @returns The style object that should be applied to the peer.
     */
    getPeerStyle: (peer: FlowSessionParticipantJSON): CSSProperties => {
      const { x, y } = worldToView(peer.position)
      return {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'none',
        transition: 'all 0.1s ease',
        zIndex: 9999,
      }
    },

    ////////////////////////////

    /**
     * On mouse down on the editor, drag the viewplane accross the screen.
     * This is done by setting the `cursor: grabbing` style on the editor
     * element and updating the transform based on the mouse movement.
     *
     * @param event The mouse down event that contains the initial position.
     */
    onScreenMouseDown: (event: MouseEvent) => {
      if (event.button === 0) {
        viewSelecting.value = true
        viewSelectFrom.value = { x: event.clientX, y: event.clientY }
        viewSelectTo.value = { x: event.clientX, y: event.clientY }
        nodeSelectedIds.value = new Set()
      }

      else if (event.button) {
        viewMoving.value = true
        viewDragOriginScreen.value = { x: event.clientX, y: event.clientY }
        viewDragOriginWorld.value = { x: viewPosition.value.x, y: viewPosition.value.y }
      }
    },

    /**
     * When the mouse moves over the editor, update the cursor position and if the
     * `isMoving` flag is set, update the viewplane position based on the mouse movement.
     *
     * @param event The mouse move event that contains the new position.
     */
    onScreenMouseMove: (event: MouseEvent) => {
      cursorView.value = screenToView({ x: event.clientX, y: event.clientY })
      cursorWorld.value = screenToWorld({ x: event.clientX, y: event.clientY })
      const userPosition = screenToWorld({ x: event.clientX, y: event.clientY })
      onUserSetPosition(userPosition.x, userPosition.y)

      // --- If the viewplane is moving, update the position based on the mouse movement.
      if (viewMoving.value) {
        const deltaX = event.clientX - viewDragOriginScreen.value.x
        const deltaY = event.clientY - viewDragOriginScreen.value.y
        viewPosition.value.x = viewDragOriginWorld.value.x + deltaX / viewZoom.value
        viewPosition.value.y = viewDragOriginWorld.value.y + deltaY / viewZoom.value
      }

      // --- If selecting, update the selector position based on the mouse movement.
      else if (viewSelecting.value) {
        viewSelectTo.value = { x: event.clientX, y: event.clientY }

        // --- Check if the nodes are within the selection box.
        const selectFrom = viewSelectFrom.value
        const selectTo = viewSelectTo.value
        const selectTop = Math.min(selectFrom.y, selectTo.y)
        const selectLeft = Math.min(selectFrom.x, selectTo.x)
        const selectBottom = Math.max(selectFrom.y, selectTo.y)
        const selectRight = Math.max(selectFrom.x, selectTo.x)
        const selectedIds = Object.entries(nodeComponents.value)
          .filter(([, component]) => {
            if (!component) return false
            const element = component.$el as HTMLElement | undefined
            if (!element) return false
            const node = element.getBoundingClientRect()
            return (
              node.top < selectBottom
              && node.bottom > selectTop
              && node.left < selectRight
              && node.right > selectLeft
            )
          })
          .map(([id]) => id)

        // --- Update the selected nodes.
        nodeSelectedIds.value = new Set(selectedIds)
      }

      // --- If dragging a node, update the position based on the mouse movement.
      else if (nodeDragging.value) {
        for (const node of nodeSelected.value) {
          const deltaX = event.clientX - nodeDragOriginScreen.value.x
          const deltaY = event.clientY - nodeDragOriginScreen.value.y
          const nodeDragOrigin = nodeDragOriginWorld.value[node.id]
          if (!nodeDragOrigin) return
          node.position.x = nodeDragOrigin.x + deltaX / viewZoom.value
          node.position.y = nodeDragOrigin.y + deltaY / viewZoom.value
        }

        // --- Update the position of the selected nodes.
        onNodesMove(nodeSelected.value.map(node => ({
          nodeId: node.id,
          x: node.position.x,
          y: node.position.y,
        })))
      }

      // --- If dragging a link, update the link position based on the mouse movement.
      else if (linkDragFrom.value) {
        const source = screenToView(linkDragFrom.value.position)
        const target = screenToView({ x: event.clientX, y: event.clientY })
        linkDragProps.value = {
          sourceX: source.x,
          sourceY: source.y,
          targetX: target.x,
          targetY: target.y,
          sourceColor: linkDragFrom.value.color ?? 'black',
          targetColor: linkDragFrom.value.color ?? 'black',
        }
      }
    },

    /**
     * On mouse up on the editor, stop dragging the viewplane.
     * This is done by resetting the `cursor` style and the `isMoving` flag.
     *
     * When dropping a link, emit the `nodeLink` event trigger the parent
     * component to link the two nodes together and broadcast the new link.
     */
    onScreenMouseUp: () => {
      if (!view.value) return
      viewMoving.value = false
      viewSelecting.value = false
      nodeDragging.value = false

      // --- If a drag link is active, emit a link remove event.
      if (linkDragFrom.value && !linkDragTo.value) {
        onLinkRemove(linkDragFrom.value.id)
        linkDragFrom.value = undefined
        linkDragTo.value = undefined
      }
    },

    /**
     * On mouse scroll, zoom in or out of the viewplane.
     *
     * @param event The mouse scroll event that contains the delta.
     */
    onScreenWheel: (event: WheelEvent) => {
      const oldCursor = screenToView({ x: event.clientX, y: event.clientY })
      viewZoom.value = viewZoom.value - event.deltaY / 1000
      viewZoom.value = Math.max(0.1, Math.min(2, viewZoom.value))
      viewZoom.value = Math.round(viewZoom.value * 10) / 10

      // --- Cancel all actions to avoid position shifts.
      viewMoving.value = false
      viewSelecting.value = false

      // --- Offset the position so the cursor stays in the same world position.
      // --- This is done by calculating the difference between the old and new cursor position
      // --- and adding the difference to the view position.
      const newCursor = screenToView({ x: event.clientX, y: event.clientY })
      viewPosition.value.x += (newCursor.x - oldCursor.x)
      viewPosition.value.y += (newCursor.y - oldCursor.y)
    },

    /**
     * When dropping an `application/json` file, emit the `nodeCreate` event
     * to trigger the parent component to create a new node based on the
     * dropped JSON data.
     *
     * @param event The drop event that contains the JSON data.
     */
    onScreenDrop: (event: DragEvent) => {
      if (!event.dataTransfer) return
      const json = event.dataTransfer.getData('application/json')
      if (!json) return
      const data = JSON.parse(json) as DropPayload

      // --- Handle the creation of a new node.
      if (data.type === 'nodeCreate') {
        if (!view.value) return
        const { x, y } = screenToWorld({ x: event.clientX, y: event.clientY })
        onNodeCreate(data.kind, x, y)
      }
    },

    /**
     * When a key is pressed, handle the event accordingly.
     *
     * @param event The key event that contains the key code.
     */
    onScreenKeyDown: (event: KeyboardEvent) => {
      const isInputActive
        = document.activeElement instanceof HTMLInputElement
        || document.activeElement instanceof HTMLTextAreaElement
        || document.activeElement instanceof HTMLSelectElement

      if (isInputActive) return
      if (nodeSelectedIds.value.size === 0) return

      // --- Handle the duplicate key to duplicate the selected nodes.
      if (nodeSelectedIds.value.size === 1 && event.key === 'd' && event.ctrlKey) {
        event.preventDefault()
        const nodeId = [...nodeSelectedIds.value][0]
        const { x, y } = cursorWorld.value
        onNodeDuplicate(nodeId, x, y)
        return
      }

      // --- Handle the delete key to remove the selected nodes.
      if (nodeSelectedIds.value.size > 0) {

        // --- Handle the delete key to remove the selected nodes.
        if (event.key === 'Delete' || event.key === 'Backspace')
          onNodesRemove([...nodeSelectedIds.value])

        // --- Handle the move key to move the selected nodes.
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          const factor = event.shiftKey ? 100 : 10
          const offset = { x: 0, y: 0 }
          if (event.key === 'ArrowUp') offset.y -= factor
          if (event.key === 'ArrowDown') offset.y += factor
          if (event.key === 'ArrowLeft') offset.x -= factor
          if (event.key === 'ArrowRight') offset.x += factor

          // --- Update the position of the selected nodes.
          const payload = nodeSelected.value.map(node => ({
            nodeId: node.id,
            x: node.position.x + offset.x,
            y: node.position.y + offset.y,
          }))

          // --- Update the position of the selected nodes.
          onNodesMove(payload)
        }
      }
    },

    ////////////////////////////

    /**
     * When clicking on the header of a node, select the node and start the
     * drag operation to move the node around the viewplane.
     *
     * @param event The mouse event that contains the initial position.
     * @param nodeId The ID of the node that is being dragged.
     */
    onNodeHandleGrab: (event: MouseEvent, nodeId: string) => {
      event.stopPropagation()
      nodeDragging.value = true

      // --- If multiple nodes are selected, only move the selected nodes.
      if (!event.ctrlKey && nodeSelectedIds.value.size === 1)
        nodeSelectedIds.value = new Set([nodeId])
      nodeSelectedIds.value.add(nodeId)

      // --- Update the drag origin to the current mouse position so the node
      // --- stays next to the cursor when dragging it around the viewplane.
      nodeDragOriginScreen.value = { x: event.clientX, y: event.clientY }
      nodeDragOriginWorld.value = Object.fromEntries(nodeSelected.value.map(node => [node.id, { ...node.position }]))
    },

    /**
     * When releasing the mouse button, stop dragging the node so it stays in place.
     */
    onNodeHandleRelease: () => {
      nodeDragging.value = false
      // nodeDragOffset.value = { x: 0, y: 0 }
    },

    /**
     * When a node is clicked, select the node and update the selected node ID.
     * If the `ctrl` or `shift` key is pressed, add the node to the selection.
     * If the `shift` key is pressed, remove the node from the selection.
     *
     * @param event The mouse event that contains the key modifiers.
     * @param nodeId The ID of the node that was clicked.
     */
    onNodeClick: (event: MouseEvent, nodeId: string) => {
      if (event.ctrlKey && nodeSelectedIds.value.has(nodeId)) nodeSelectedIds.value.delete(nodeId)
      else if (event.ctrlKey && !nodeSelectedIds.value.has(nodeId)) nodeSelectedIds.value.add(nodeId)
      else nodeSelectedIds.value = new Set([nodeId])
    },

    /**
     * Check if the node with the given ID is selected.
     *
     * @param nodeId The ID of the node to check.
     * @returns `true` if the node is selected, otherwise `false`.
     */
    isNodeSelected: (nodeId: string): boolean => nodeSelectedIds.value.has(nodeId),

    ////////////////////////////

    /**
     * When a port is being dragged, update the `dragLinkTo` state to the port
     * that is being dragged to.
     *
     * @param state The port that is being dragged to.
     */
    onNodePortGrab: (state?: FlowDragState) => {
      if (!state) return
      linkDragFrom.value = state
    },

    /**
     * When a port is being dragged onto another port, update the `dragLinkTo` state
     * to the port that is being dragged to.
     *
     * @param state The port that is being dragged to.
     */
    onNodePortAssign: (state?: FlowDragState | void) => {
      if (state?.id === linkDragFrom.value?.id) return
      linkDragTo.value = state
    },

    /**
     * When a port is being dragged and the mouse button is released, determine
     * if the port is being dropped on another port and if so, emit the `linkCreate`
     * event to trigger the parent component to create a new link between the two ports.
     */
    onNodePortRelease: () => {
      const from = linkDragFrom.value
      const to = linkDragTo.value
      linkDragFrom.value = undefined
      linkDragTo.value = undefined
      if (!from || !to) return
      else if (to.kind === 'source') onLinkCreate(to.id, from.id)
      else if (from.kind === 'source') onLinkCreate(from.id, to.id)
    },

    /**
     * Compute the link that is being dragged from one node to another.
     * This link is computed based on the position of the mouse and the node
     * that is being dragged from.
     */
    linkDragProps: computed((): FlowLinkProps | undefined => {
      if (!linkDragFrom.value) return
      const { position, color, kind } = linkDragFrom.value
      const viewPosition = screenToView(position)
      return {
        sourceX: kind === 'source' ? viewPosition.x : cursorView.value.x,
        sourceY: kind === 'source' ? viewPosition.y : cursorView.value.y,
        targetX: kind === 'source' ? cursorView.value.x : viewPosition.x,
        targetY: kind === 'source' ? cursorView.value.y : viewPosition.y,
        sourceColor: color,
        targetColor: color,
      }
    }),
  })
}
