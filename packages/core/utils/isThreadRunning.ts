import type { Thread } from '../thread'
import { getLinks } from '../thread'
import { isNodeUsedAsTool } from './isNodeUsedAsTool'

/**
 * Check if a thread is running by checking if at least one of the component instances is
 * still not done. If at least one of the component instances is still not done, then the
 * thread is still running.
 *
 * @param thread The thread to check.
 * @param links The links of the thread.
 * @returns Returns `true` if the thread is still running, otherwise `false`.
 */
export function isThreadRunning(thread: Thread, links = getLinks(thread)): boolean {
  for (const [id, node] of thread.nodes) {
    if (isNodeUsedAsTool(thread, id, links)) continue
    if (node.state === 'starting') return true
    if (node.state === 'processing') return true
    if (node.state === 'idle') return true
  }
  return false
}
