import type { Thread } from './createThread'
import { getLinks } from './getLinks'

/**
 * Check if a node is used as a tool in the thread. A node is considered a tool
 * if it only has at least one outgoing link without a source name.
 *
 * @param thread The thread where the node is located.
 * @param nodeId The ID of the node.
 * @param links The links of the thread.
 * @returns Whether the node is used as a tool.
 */
export function isNodeUsedAsTool(thread: Thread, nodeId: string, links = getLinks(thread)): boolean {
  const outgoingLinks = links.filter(link => link.sourceId === nodeId)
  if (outgoingLinks.length === 0) return false
  return outgoingLinks.some(link => link.sourceName === undefined)
}
