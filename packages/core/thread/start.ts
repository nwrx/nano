import type { ObjectLike } from '@unshared/types'
import type { Node } from './addNode'
import type { Thread } from './createThread'
import { createResolvable } from '@unshared/functions'
import { createEventMetadata } from '../utils'
import { abort } from './abort'
import { getLinks } from './getLinks'
import { getNode } from './getNode'
import { getNodeData } from './getNodeData'
import { isNodeReadyToStart } from './isNodeReadyToStart'
import { isThreadRunning } from './isThreadRunning'
import { startNode } from './startNode'

function isCoreComponent(node: Node, name: string) {
  return node.registry === 'default'
    && node.collection === 'core'
    && node.tag === 'latest'
    && node.name === name
}

export async function start(thread: Thread, input: ObjectLike = {}): Promise<ObjectLike> {
  const output: ObjectLike = {}
  const links = getLinks(thread)
  const resolvable = createResolvable<ObjectLike>()
  thread.startedAt = Date.now()
  thread.dispatch('start', input, createEventMetadata(thread))

  // --- Look for `core/input` nodes and apply the thread input to them.
  for (const [,node] of thread.nodes) {
    if (isCoreComponent(node, 'input')) {
      const name = node.input.name as string
      const required = node.input.required as boolean
      const value = input[name]
      if (required && value === undefined)
        throw new Error(`Input "${name}" is required but not provided.`)
      node.result = { value: input[name] }
    }
  }

  // --- If an error occurs in any of the nodes, dispatch the error event and reject the promise.
  const clearOnNodeError = thread.on('nodeError', (_, error) => {
    thread.dispatch('error', error, createEventMetadata(thread))
    resolvable.reject(error)
    abort(thread)
  })

  const clearOnNodeDone = thread.on('nodeDone', async(id) => {

    // --- If the node is an output, we collect this specific output value and it's corresponding name
    // --- and apply it to the thread output. We also dispatch the output event with the name and value.
    const node = getNode(thread, id)
    if (isCoreComponent(node, 'output')) {
      const { name, value } = await getNodeData(thread, id) as { name: string; value: string }
      output[name] = value
      thread.dispatch('output', name, value, createEventMetadata(thread))
    }

    // --- If the node has outgoing links, start the next nodes
    // --- if all their incoming nodes are done.
    const outgoingLinks = links.filter(link => link.sourceId === id)
    for (const link of outgoingLinks) {
      if (!isNodeReadyToStart(thread, link.targetId)) continue
      void startNode(thread, link.targetId).catch(() => {})
    }

    // --- If all the nodes are done, dispatch the end event.
    if (isThreadRunning(thread)) return
    thread.dispatch('done', output, createEventMetadata(thread))
    resolvable.resolve(output)
  })

  // --- Iterate over all the nodes and resolve their components. Then, for each node
  // --- that has no incoming links, start them.
  for (const [id] of thread.nodes) {
    const hasIncomingLinks = links.some(link => link.targetId === id)
    if (hasIncomingLinks) continue
    void startNode(thread, id).catch(() => {})
  }

  // --- Return the output object.
  return resolvable.promise.finally(() => {
    clearOnNodeDone()
    clearOnNodeError()
  })
}
