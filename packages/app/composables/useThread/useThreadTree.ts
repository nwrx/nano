/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/prefer-single-boolean-return */
import type { FlowSchema, ThreadEventObject, ThreadObject } from '@nwrx/nano-api'

export interface ThreadTree {
  maxDepth: number
  items: ThreadTree.Item[]
}

export namespace ThreadTree {
  export type ItemLine =
    | 'end'
    | 'hidden'
    | 'line'
    | 'start'

  export interface Item {
    event: ThreadEventObject
    node: FlowSchema.Node | undefined
    tree: Tree[]
  }

  export interface Tree {
    depth: number
    color: string
    showPin: boolean
    showLine: ItemLine
  }
}

function getThreadEventNode(thread: ThreadObject, event: ThreadEventObject): FlowSchema.Node | undefined {
  if (!thread) return
  if (!thread.schema) return
  if (!event.message.event.startsWith('node')) return
  if ('data' in event.message === false) return
  if (!Array.isArray(event.message.data)) return
  if (typeof event.message.data[0] !== 'string') return
  const id = event.message.data[0]
  return thread.schema.nodes.find(node => node.id === id)
}

export function useThreadTree(thread: ThreadObject): ThreadTree {
  const events = thread.events ?? []
  const items: ThreadTree.Item[] = []
  const treeById = new Map<string, ThreadTree.Tree>()
  const nodeByEvent = new Map<ThreadEventObject, FlowSchema.Node | undefined>()
  let maxDepth = 0

  const eventSorted = events
    .toSorted((a, b) => a.index - b.index)
    .filter((event) => {
      if (event.message.event === 'worker.loaded') return false
      if (event.message.event === 'worker.ready') return false
      if (event.message.event === 'worker.references.resolve') return false
      if (event.message.event === 'nodeState') return false
      return true
    })

  // --- Map the events to their nodes if applicable. This has two purposes,
  // --- first to designate which event is associated with a node, and second to
  // --- cache the nodes since they are used multiple times in the tree.
  for (const event of eventSorted) {
    const node = getThreadEventNode(thread, event)
    nodeByEvent.set(event, node)
  }

  // --- For a given node, collect all the events that are associated with it.
  const eventsByNode = new Map<string, ThreadEventObject[]>()
  for (const event of eventSorted) {
    const node = nodeByEvent.get(event)
    if (!node) continue
    if (!eventsByNode.has(node.id)) eventsByNode.set(node.id, [])
    eventsByNode.get(node.id)!.push(event)
  }

  // --- Compute at which index in the event list each node ends. This is computed
  // --- by looking at the next events. If no event with the same node is found,
  // --- the node is considered to be done.
  const eventLastIndex = new Map<string, number>()
  for (const [nodeId, nodeEvents] of eventsByNode) {
    const lastEvent = nodeEvents.at(-1)
    if (lastEvent) eventLastIndex.set(nodeId, lastEvent.index)
  }

  // --- For each event, compute the tree item. The tree item is a representation
  // --- of the event in the tree, with its depth, color, and whether it
  let index = 0
  for (const event of eventSorted) {

    // --- Map the tree items to their depth.
    let currentDepth = treeById.size
    const treeByDepth = new Map<number, ThreadTree.Tree>()
    for (const item of treeById.values()) treeByDepth.set(item.depth, item)

    // --- Get the node associated with the event.
    const node = nodeByEvent.get(event)
    if (node) {
      const treeItem = treeById.get(node.id)
      const isLastEvent = eventLastIndex.get(node.id) === event.index

      // --- If the node already exists, update its depth and line.
      if (treeItem) {
        currentDepth = treeItem.depth
        if (isLastEvent) {
          treeItem.showLine = 'end'
          treeById.delete(node.id)
        }
        else {
          treeItem.showLine = 'line'
        }
      }

      // --- If the node does not exist, create a new one.
      // --- Find a depth that is not already used and assign it to the node.
      else {
        let depth = 0
        while (treeByDepth.has(depth)) depth++
        currentDepth = depth
        const treeItem: ThreadTree.Tree = {
          depth: currentDepth,
          color: node.color,
          showLine: isLastEvent ? 'hidden' : 'start',
          showPin: true,
        }
        if (!isLastEvent) treeById.set(node.id, treeItem)
        treeByDepth.set(currentDepth, treeItem)
      }
    }

    // --- Build the tree item for the event. This includes the depth, color, and whether
    // --- it should show a pin or a line. A pin is shown at the depth corresponding to the node.
    maxDepth = Math.max(maxDepth, treeById.size)
    const isFinalEvent = index === eventSorted.length - 1
    const tree = Array.from({ length: maxDepth }, (_, depth) => {
      const t = treeByDepth.get(depth)
      if (t) {
        return {
          depth: t.depth,
          color: t.color,
          showPin: depth === currentDepth || isFinalEvent,
          showLine: depth === currentDepth ? t.showLine : 'line',
        } as ThreadTree.Tree
      }
      return {
        depth,
        color: 'transparent',
        showPin: false,
        showLine: isFinalEvent ? 'hidden' : 'line',
      } as ThreadTree.Tree
    })

    // --- Push the item to the items array.
    items.push({ event, node, tree })
    index++
  }

  return { maxDepth, items }
}
