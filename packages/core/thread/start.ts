import type { ObjectLike } from '@unshared/types'
import type { Thread } from './createThread'
import { createResolvable } from '@unshared/functions'
import { ERRORS as E, isNodeReadyToStart, isNodeUsedAsTool, isThreadRunning } from '../utils'
import { getLinks } from './getLinks'
import { startNode } from './startNode'

export async function start(thread: Thread, input: ObjectLike = {}): Promise<ObjectLike> {
  const links = getLinks(thread)
  const resolvable = createResolvable<ObjectLike>()
  thread.input = input
  thread.startedAt = Date.now()
  thread.dispatch('start', input)

  // --- To avoid concurrency issues, prevent the thread from starting if it is already running.
  if (isThreadRunning(thread, links)) throw E.THREAD_IS_ALREADY_RUNNING()

  // --- If no nodes are present, resolve the promise immediately.
  if (thread.nodes.size === 0) {
    thread.dispatch('done', thread.output)
    resolvable.resolve(thread.output)
    return resolvable.promise
  }

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
    if (isThreadRunning(thread, links)) return
    thread.dispatch('done', thread.output)
    resolvable.resolve(thread.output)
  })

  // --- If an error occurs in any of the nodes, dispatch the error event and reject the promise.
  const clearOnNodeError = thread.on('nodeError', async(_, error) => {
    await new Promise(setImmediate)
    if (isThreadRunning(thread, links)) return
    resolvable.reject(error)
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
