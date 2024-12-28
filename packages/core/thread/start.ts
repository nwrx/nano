import type { ObjectLike } from '@unshared/types'
import type { Thread } from './createThread'
import { createResolvable } from '@unshared/functions'
import { createEventMetadata } from '../utils'
import { getLinks } from './getLinks'
import { isNodeReadyToStart } from './isNodeReadyToStart'
import { isNodeUsedAsTool } from './isNodeUsedAsTool'
import { isThreadRunning } from './isThreadRunning'
import { startNode } from './startNode'

export async function start(thread: Thread, input: ObjectLike = {}): Promise<ObjectLike> {
  const links = getLinks(thread)
  const resolvable = createResolvable<ObjectLike>()
  thread.startedAt = Date.now()
  thread.dispatch('start', input, createEventMetadata(thread))

  // --- If an error occurs in any of the nodes, dispatch the error event and reject the promise.
  const clearOnNodeError = thread.on('nodeError', async(_, error) => {
    await new Promise(setImmediate)
    if (isThreadRunning(thread)) return
    thread.dispatch('error', error, createEventMetadata(thread))
    resolvable.reject(error)
  })

  // --- If the node has outgoing links, start them when the node is done.
  const clearOnNodeDone = thread.on('nodeDone', async(id) => {
    if (isNodeUsedAsTool(thread, id, links)) return
    const outgoingLinks = links.filter(link => link.sourceId === id)
    for (const link of outgoingLinks) {
      if (!isNodeReadyToStart(thread, link.targetId, links)) continue
      void startNode(thread, link.targetId).catch(() => {})
    }

    // --- If all the nodes are done, it means the thread is done.
    await new Promise(setImmediate)
    if (isThreadRunning(thread)) return
    thread.dispatch('done', thread.output, createEventMetadata(thread))
    resolvable.resolve(thread.output)
  })

  // --- Start nodes with no incoming links.
  for (const [nodeId] of thread.nodes) {
    if (!isNodeReadyToStart(thread, nodeId, links)) continue
    if (isNodeUsedAsTool(thread, nodeId, links)) continue
    void startNode(thread, nodeId).catch(() => {})
  }

  // --- Return the output object and clean up the event listeners.
  return resolvable.promise.finally(() => {
    clearOnNodeDone()
    clearOnNodeError()
  })
}
