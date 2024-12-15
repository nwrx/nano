import type { Thread } from './createThread'

/**
 * Aborts a thread and all its nodes.
 *
 * @param thread The thread to abort.
 */
export function abort(thread: Thread) {
  thread.abortController.abort()
  thread.dispatch('abort', thread.eventMetadata)
  thread.abortController = new AbortController()
  for (const [, node] of thread.nodes) node.abort()
}
