/* eslint-disable sonarjs/no-commented-code */
/* eslint-disable unicorn/prevent-abbreviations */
import type { Link } from '@nwrx/nano'
import type { Editor } from '@nwrx/nano-api'
import type { Position } from '@vueuse/core'
import type { ComponentInstance, CSSProperties, VNodeRef } from 'vue'
import type EditorNode from '~/components/editorNode/EditorNode.vue'
import { memoize } from '@unshared/functions/memoize'
import { useAlerts } from '@unshared/vue/useAlerts'
import { getLinks } from './getLinks'

export interface FlowLinkProps {
  sourceX: number
  sourceY: number
  sourceColor: string
  targetX: number
  targetY: number
  targetColor: string
}

export type EditorView = ReturnType<typeof useEditorView>

export interface EditorViewOptions {
  nodes?: Ref<Editor.NodeObject[]>
  components?: Ref<Editor.ComponentObject[]>
  componentGroups?: Ref<Editor.ComponentGroup[]>
  handleNodesClone?: (...values: Editor.MessageClientDataByName<'nodes.clone'>) => void
  handleNodesCreate?: (...values: Editor.MessageClientDataByName<'nodes.create'>) => void
  handleNodesRemove?: (...values: Editor.MessageClientDataByName<'nodes.remove'>) => void
  handleNodesLinksCreate?: (...values: Editor.MessageClientDataByName<'nodes.links.create'>) => void
  handleNodesLinksRemove?: (...values: Editor.MessageClientDataByName<'nodes.links.remove'>) => void
  handleNodesMetadataUpdate?: (...values: Editor.MessageClientDataByName<'nodes.metadata.update'>) => void
}

export function useEditorView(options: EditorViewOptions = {}) {
  const alerts = useAlerts()
  const settings = useLocalSettings()

  // --- Destructure the options.
  const {
    nodes = ref<Editor.NodeObject[]>([]),
    components = ref<Editor.ComponentObject[]>([]),
    componentGroups = ref<Editor.ComponentGroup[]>([]),
    handleNodesClone = () => alerts.error('The "onCloneNodes" method is not implemented.'),
    handleNodesCreate = () => alerts.error('The "handleNodesCreate" method is not implemented.'),
    handleNodesRemove = () => alerts.error('The "handleNodesRemove" method is not implemented.'),
    handleNodesLinksCreate = () => alerts.error('The "handleNodesLinksCreate" method is not implemented.'),
    handleNodesLinksRemove = () => alerts.error('The "handleNodesLinksRemove" method is not implemented.'),
    handleNodesMetadataUpdate = () => alerts.error('The "handleNodesMetadataUpdate" method is not implemented.'),
  } = options

  // --- View references.
  const view = ref<HTMLDivElement>()
  const viewContainer = ref<HTMLDivElement>()
  const viewNodes = ref<Record<string, ComponentInstance<typeof EditorNode>>>({})

  // --- Component references.
  const setView: VNodeRef = (element) => { view.value = element as HTMLDivElement }
  const setViewContainer: VNodeRef = (element) => { viewContainer.value = element as HTMLDivElement }
  const setViewNode = (id: string, component: Element | globalThis.ComponentPublicInstance | null) => {
    if (!component) return delete viewNodes.value[id]
    // @ts-expect-error: component type is not relevant.
    viewNodes.value[id] = component
  }

  // --- View states.
  const viewSize = 10e4
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

  // --- Cursor state.
  const cursorClient = ref({ x: 0, y: 0 })
  const cursorView = ref({ x: 0, y: 0 })
  const cursorWorld = ref({ x: 0, y: 0 })

  // --- Panel state.
  const panelTab = ref<string>('flow')
  const panelResizeOrigin = ref(0)
  const panelResizeInitial = ref(0)
  const isPanelResizing = ref(false)
  const isPanelOpen = computed({
    get: () => settings.value.editorPanelOpen ?? true,
    set: value => settings.value.editorPanelOpen = value,
  })
  const panelWidth = computed({
    get: () => settings.value.editorPanelWidth ?? 512,
    set: value => settings.value.editorPanelWidth = value,
  })
  watch(isPanelResizing, (isPanelResizing) => {
    if (!isPanelResizing) return
    panelResizeOrigin.value = cursorClient.value.x
    panelResizeInitial.value = panelWidth.value
  })

  // --- Node(s) state.
  const nodeDragging = ref(false)
  const nodeDragOriginWorld = ref<Record<string, Position>>({})
  const nodeDragOriginScreen = ref({ x: 0, y: 0 })
  const nodeSelectedIds = ref(new Set<string>())
  const nodeSelected = computed(() => nodes.value.filter(node => nodeSelectedIds.value.has(node.id)))

  // --- Initialize the drag link state.
  const links = computed(() => getLinks(nodes.value))
  const linksProps = ref<FlowLinkProps[]>([])
  const linkDragFrom = ref<Partial<Link>>()
  const linkDragTo = ref<Partial<Link>>()

  // --- Compute the link properties based on the links and nodes.
  watch([links, nodes, viewZoom], ([links, nodes]) => setTimeout(() => {
    linksProps.value = links.map((link) => {
      const nodeSource = nodes.find(node => node.id === link.sourceId)
      const nodeTarget = nodes.find(node => node.id === link.targetId)
      if (!nodeSource || !nodeTarget) return console.error('Node not found')
      const pinSource = getPinAttributes(link, 'source')
      const pinTarget = getPinAttributes(link, 'target')
      if (!pinSource || !pinTarget) return console.error('Pin not found')
      return {
        sourceX: pinSource.position.x,
        sourceY: pinSource.position.y,
        targetX: pinTarget.position.x,
        targetY: pinTarget.position.y,
        sourceColor: pinSource.color,
        targetColor: pinTarget.color,
      }
    }).filter(Boolean) as FlowLinkProps[]
  }, 1), { immediate: true, deep: true })

  // --- Handle the z-index of the nodes. Each time a node is clicked, the z-index
  // --- is increased to bring the node to the front. This is done by incrementing
  // --- the `zIndexCounter` and storing the z-index in the `zIndexMap`.
  const zIndexCounter = ref(-1)
  const zIndexMap = reactive<Record<string, number>>({})
  watch(nodeSelectedIds, () => {
    if (zIndexCounter.value === -1) zIndexCounter.value = nodes.value.length
    for (const id of nodeSelectedIds.value) zIndexMap[id] = zIndexCounter.value++
  }, { deep: true })

  // --- Collect all nodes and compute their component, style and header style.
  const getNodeColor = memoize((node: Editor.NodeObject) => {
    const component = components.value.find(x => x.name === node.name)
    if (!component) return 'black'
    // if (component.color) return component.color
    const group = componentGroups.value.find(g => g.name === component.purpose)
    if (group?.color) return group.color
    return 'black'
  }, {
    getKey: (node: Editor.NodeObject) => node.id,
  })

  const getNodeStyle = (node: Editor.NodeObject): CSSProperties => {
    const { x, y } = worldToView(node.metadata.position ?? { x: 0, y: 0 })
    const color = getNodeColor(node)
    const isSelected = nodeSelectedIds.value.has(node.id)
    return {
      'position': 'absolute',
      'left': `${x}px`,
      'top': `${y}px`,
      'zIndex': zIndexMap[node.id] ?? 1,
      '--un-ring-color': color,
      '--un-ring-width': `${(isSelected ? 5 : 1) / (viewZoom.value)}px`,
    }
  }

  const getNodeComponent = (node: Editor.NodeObject): Editor.ComponentObject => {
    const component = components.value.find(x => x.name === node.specifier)
    if (component) return component
    // Create fallback component if not found.
    return {
      name: node.specifier,
      title: node.specifier,
      version: '0.0.0',
    }
  }

  const getNodeHeaderStyle = memoize((node: Editor.NodeObject): CSSProperties => ({
    backgroundColor: getNodeColor(node),
    cursor: nodeDragging.value ? 'grabbing' : 'pointer',
  }), { getKey: (node: Editor.NodeObject) => node.id })

  const nodesView = computed(() => nodes.value.map(node => ({
    id: node.id,
    style: getNodeStyle(node),
    component: getNodeComponent(node),
    styleHeader: getNodeHeaderStyle(node),
    node,
  })))

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

  // --- Get the pin element based on the link ID.
  function getPinAttributes(link?: Partial<Link>, type?: 'source' | 'target') {
    if (!link) return
    if (!link.sourceId && !link.targetId) return

    // --- Try the Pin at path.
    const pinSelectorDataId = type === 'source'
      ? ['pin', type, link.sourceId, link.sourceName, link.sourcePath].filter(Boolean).join('-')
      : ['pin', type, link.targetId, link.targetName, link.targetPath].filter(Boolean).join('-')
    const pinSelector = `[data-id="${pinSelectorDataId}"]`
    let pinElement = document.querySelector<HTMLDivElement>(pinSelector)

    // --- Try again without the path.
    if (!pinElement) {
      const pinSelectorDataId = type === 'source'
        ? ['pin', type, link.sourceId, link.sourceName].filter(Boolean).join('-')
        : ['pin', type, link.targetId, link.targetName].filter(Boolean).join('-')
      const pinSelector = `[data-id="${pinSelectorDataId}"]`
      pinElement = document.querySelector<HTMLDivElement>(pinSelector)
    }

    // --- Get the position and color of the pin.
    if (!pinElement) return
    const { x, y, width, height } = pinElement.getBoundingClientRect()
    return {
      color: pinElement.dataset.color ?? 'black',
      position: screenToView({ x: x + width / 2, y: y + height / 2 }),
    }
  }

  return toReactive({
    setView,
    setViewContainer,
    setViewNode,

    worldToView,
    screenToWorld,
    screenToView,

    view,
    viewContainer,
    viewPosition,
    viewZoom,
    viewMoving,
    viewDragOriginScreen,
    viewDragOriginWorld,
    viewSelecting,

    panelTab,
    panelWidth,
    isPanelOpen,
    isPanelResizing,

    cursorView,
    cursorWorld,

    nodes,
    nodesView,
    nodeSelectedIds,
    nodeSelected,
    nodeDragging,
    nodeDragOriginScreen,
    nodeDragOriginWorld,

    links,
    linksProps,
    linkDragFrom,
    linkDragTo,

    viewContainerStyle: computed<CSSProperties>(() => ({
      cursor: viewMoving.value ? 'grabbing' : 'auto',
    })),

    viewStyle: computed<CSSProperties>(() => {
      const { width, height } = viewContainerRect
      const viewX = (viewPosition.value.x * viewZoom.value) + (width / 2) - (viewSize / 2)
      const viewY = (viewPosition.value.y * viewZoom.value) + (height / 2) - (viewSize / 2)
      return {
        position: 'absolute',
        left: `${viewX}px`,
        top: `${viewY}px`,
        transform: `scale(${viewZoom.value})`,
        width: `${viewSize}px`,
        height: `${viewSize}px`,
      }
    }),

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

    /***************************************************************************/
    /* Screen                                                                  */
    /***************************************************************************/

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

      // --- Reset text selection.
      if (globalThis.getSelection) globalThis.getSelection()?.removeAllRanges()
    },

    onScreenMouseMove: (event: MouseEvent) => {
      cursorClient.value = { x: event.clientX, y: event.clientY }
      cursorView.value = screenToView({ x: event.clientX, y: event.clientY })
      cursorWorld.value = screenToWorld({ x: event.clientX, y: event.clientY })
      // const userPosition = screenToWorld({ x: event.clientX, y: event.clientY })
      // model.setUserPosition(userPosition.x, userPosition.y)

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
        const selectedNodes = Object.entries(viewNodes.value)
          .filter(([, component]) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const element = component.$el as HTMLElement
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
        nodeSelectedIds.value = new Set(selectedNodes)
      }

      // --- If dragging a node, update the position based on the mouse movement.
      else if (nodeDragging.value) {
        for (const node of nodeSelected.value) {
          const deltaX = event.clientX - nodeDragOriginScreen.value.x
          const deltaY = event.clientY - nodeDragOriginScreen.value.y
          const nodeDragOrigin = nodeDragOriginWorld.value[node.id] ?? { x: 0, y: 0 }
          if (!nodeDragOrigin) return
          node.metadata.position = node.metadata.position ?? { x: 0, y: 0 }
          node.metadata.position.x = nodeDragOrigin.x + deltaX / viewZoom.value
          node.metadata.position.y = nodeDragOrigin.y + deltaY / viewZoom.value
        }

        // --- Update the position of the selected nodes.
        handleNodesMetadataUpdate(...nodeSelected.value.map(node => ({
          id: node.id,
          name: 'position',
          value: node.metadata.position,
        })) as Editor.MessageClientDataByName<'nodes.metadata.update'>)
      }

      // --- If resizing the panel, update the panel width based on the mouse movement.
      else if (isPanelResizing.value) {
        const offset = panelResizeOrigin.value - cursorClient.value.x
        const width = panelResizeInitial.value + offset
        panelWidth.value = Math.max(256, Math.min(1024, width))
      }
    },

    onScreenMouseUp: (event: MouseEvent) => {
      if (!view.value) return
      viewMoving.value = false
      viewSelecting.value = false
      nodeDragging.value = false
      isPanelResizing.value = false

      // --- If a drag link is active, emit a link remove event.
      if (linkDragFrom.value && !linkDragTo.value) {
        handleNodesLinksRemove(linkDragFrom.value)
        linkDragFrom.value = undefined
        event.stopPropagation()
      }

      // --- If dragFrom and dragTo are set, emit the link create event.
      else if (linkDragFrom.value && linkDragTo.value) {
        const linkToCreate = { ...linkDragFrom.value, ...linkDragTo.value }
        const { sourceId, sourceName, sourcePath, targetId, targetName, targetPath } = linkToCreate
        if (sourceId && targetId && sourceName && targetName && sourceId !== targetId)
          handleNodesLinksCreate({ sourceId, sourceName, sourcePath, targetId, targetName, targetPath })
        linkDragFrom.value = undefined
        linkDragTo.value = undefined
        event.stopPropagation()
      }
    },

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

    onScreenDrop: (event: DragEvent) => {
      if (!event.dataTransfer) return
      const json = event.dataTransfer.getData('application/json')
      if (!json) return

      // --- Parse the drop payload.
      let data: DropPayload
      try { data = JSON.parse(json) as DropPayload }
      catch { return }

      // --- Handle the creation of a new node.
      if (data.type === 'createNode') {
        if (!view.value) return
        const { x, y } = screenToWorld({ x: event.clientX, y: event.clientY })
        handleNodesCreate({ specifier: data.kind, x, y })
      }
    },

    onScreenKeyDown: (event: KeyboardEvent) => {
      const isInputActive
        = document.activeElement instanceof HTMLInputElement
          || document.activeElement instanceof HTMLTextAreaElement
          || document.activeElement instanceof HTMLSelectElement

      // --- Grab the viewplane to move it around.
      if (event.key === ' ') {
        viewMoving.value = true
        viewDragOriginScreen.value = { x: cursorClient.value.x, y: cursorClient.value.y }
        viewDragOriginWorld.value = { x: viewPosition.value.x, y: viewPosition.value.y }
      }

      if (isInputActive) return
      if (nodeSelectedIds.value.size === 0) return

      // --- When more than one node is selected.
      if (nodeSelectedIds.value.size > 0) {

        // --- Duplicate the selected nodes.
        if (event.key === 'd' && event.ctrlKey) {
          event.preventDefault()
          const { x, y } = cursorWorld.value
          handleNodesClone({ ids: [...nodeSelectedIds.value], origin: { x, y } })
        }

        // --- Handle the delete key to remove the selected nodes.
        else if (event.key === 'Delete' || event.key === 'Backspace') {
          handleNodesRemove(...nodeSelectedIds.value)
        }

        // --- Handle the move key to move the selected nodes.
        else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          const factor = event.shiftKey ? 100 : 10
          const offset = { x: 0, y: 0 }
          if (event.key === 'ArrowUp') offset.y -= factor
          if (event.key === 'ArrowDown') offset.y += factor
          if (event.key === 'ArrowLeft') offset.x -= factor
          if (event.key === 'ArrowRight') offset.x += factor

          // --- Update the position of the selected nodes.
          handleNodesMetadataUpdate(...nodeSelected.value.map(node => ({
            id: node.id,
            name: 'position',
            value: {
              x: (node.metadata.position?.x ?? 0) + offset.x,
              y: (node.metadata.position?.y ?? 0) + offset.y,
            },
          })) as Editor.MessageClientDataByName<'nodes.metadata.update'>)
        }
      }
    },

    onScreenKeyUp: (event: KeyboardEvent) => {
      if (event.key === ' ') viewMoving.value = false
    },

    /***************************************************************************/
    /* Nodes                                                                   */
    /***************************************************************************/

    onNodeHandleGrab: (event: MouseEvent, id: string) => {
      event.stopPropagation()
      nodeDragging.value = true

      // --- If multiple nodes are selected, only move the selected nodes.
      if (!event.ctrlKey && nodeSelectedIds.value.size === 1)
        nodeSelectedIds.value = new Set([id])
      nodeSelectedIds.value.add(id)

      // --- Update the drag origin to the current mouse position so the node
      // --- stays next to the cursor when dragging it around the viewplane.
      nodeDragOriginScreen.value = { x: event.clientX, y: event.clientY }
      nodeDragOriginWorld.value = Object.fromEntries(nodeSelected.value.map(node => [
        node.id,
        { ...node.metadata.position ?? { x: 0, y: 0 } },
      ]))
    },

    onNodeHandleRelease: () => {
      nodeDragging.value = false
      // nodeDragOffset.value = { x: 0, y: 0 }
    },

    onNodeClick: (event: MouseEvent, nodeId: string) => {
      if (event.ctrlKey && nodeSelectedIds.value.has(nodeId)) nodeSelectedIds.value.delete(nodeId)
      else if (event.ctrlKey && !nodeSelectedIds.value.has(nodeId)) nodeSelectedIds.value.add(nodeId)
      else nodeSelectedIds.value = new Set([nodeId])
    },

    isNodeSelected: (id: string): boolean => nodeSelectedIds.value.has(id),

    /***************************************************************************/
    /* Links                                                                   */
    /***************************************************************************/

    onInputGrab: (id: string, name: string, path?: string) => {
      linkDragFrom.value = { targetId: id, targetName: name, targetPath: path }
    },
    onInputAssign: (id: string, name: string, path?: string) => {
      if (!linkDragFrom.value) return
      linkDragTo.value = { targetId: id, targetName: name, targetPath: path }
    },
    onInputUnassign: () => {
      if (!linkDragFrom.value) return
      linkDragTo.value = undefined
    },

    onOutputGrab: (id: string, name: string, path?: string) => {
      linkDragFrom.value = { sourceId: id, sourceName: name, sourcePath: path }
    },
    onOutputAssign: (id: string, name: string, path?: string) => {
      if (!linkDragFrom.value) return
      linkDragTo.value = { sourceId: id, sourceName: name, sourcePath: path }
    },
    onOutputUnassign: () => {
      if (!linkDragFrom.value) return
      linkDragTo.value = undefined
    },

    linkDragProps: computed((): FlowLinkProps | undefined => {
      if (!linkDragFrom.value) return
      const { sourceId } = linkDragFrom.value

      // --- Get the element of the pin that is being dragged from.
      const isOutput = Boolean(sourceId)
      const pinFrom = getPinAttributes(linkDragFrom.value, isOutput ? 'source' : 'target')
      const pinTo = getPinAttributes(linkDragTo.value, isOutput ? 'target' : 'source')
      if (!pinFrom) return

      // --- Return the computed link properties.
      return {
        sourceX: isOutput ? pinFrom.position.x : cursorView.value.x,
        sourceY: isOutput ? pinFrom.position.y : cursorView.value.y,
        targetX: isOutput ? cursorView.value.x : pinFrom.position.x,
        targetY: isOutput ? cursorView.value.y : pinFrom.position.y,
        sourceColor: isOutput ? pinFrom.color : pinTo?.color ?? pinFrom.color,
        targetColor: isOutput ? pinTo?.color ?? pinFrom.color : pinFrom.color,
      }
    }),
  })
}
