import type { Thread } from './createThread'
import { getLinks } from './getLinks'
import { getNode } from './getNode'
import { isNodeUsedAsTool } from './isNodeUsedAsTool'

/**
 * Check if a node is ready to start. A node is ready to start if all its incoming
 * nodes are done or if no incoming nodes are found.
 *
 * @param thread The thread where the node is located.
 * @param nodeId The ID of the node.
 * @param links The links of the thread.
 * @returns Whether the node is ready to start.
 */
export function isNodeReadyToStart(thread: Thread, nodeId: string, links = getLinks(thread)): boolean {
  const incommingLinks = links.filter(link => link.targetId === nodeId)
  if (incommingLinks.length === 0) return true
  for (const link of incommingLinks) {
    const sourceNode = getNode(thread, link.sourceId)
    if (isNodeUsedAsTool(thread, link.sourceId, links)) continue
    if (sourceNode.state !== 'done') return false
  }
  return true
}
