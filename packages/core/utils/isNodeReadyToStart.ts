import type { Thread } from '../thread'
import { getLinks } from './getLinks'

/**
 * Check if all incoming links to a node are DONE. If so, the node is ready to start
 * safely and the link values can be used safely.
 *
 * @param thread The thread where the node is located.
 * @param id The ID of the node.
 * @returns Whether the node is ready to start.
 */
export function isNodeReadyToStart(thread: Thread, id: string): boolean {
  const links = getLinks(thread)
  const incomingLinks = links.filter(link => link.targetId === id)
  for (const link of incomingLinks) {
    const sourceNode = thread.nodes.get(link.sourceId)
    if (!sourceNode) return false
    if (sourceNode.internalState !== 'DONE') return false
  }
  return true
}
