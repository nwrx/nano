import type { Link } from './addLink'
import type { Thread } from './createThread'
import { ERRORS as E, isLink, parseLink } from '../utils'

/**
 * Get all the links between the nodes in the thread. This function iterates over
 * all the nodes in the thread and collects the links between the nodes. If a node
 * has a property that is a string that matches the expected format of a link,
 * the link is added to the list of links.
 *
 * @param thread The thread where the nodes are located.
 * @returns The list of links between the nodes in the thread.
 * @example getLinks(thread) // [
 *   { sourceId: 'node-1', sourceName: 'output', targetId: 'node-2', targetName: 'input' },
 *   { sourceId: 'node-3', sourceName: 'output', targetId: 'node-2', targetName: 'input' }
 * ]
 */
export function getLinks(thread: Thread): Link[] {
  const links: Link[] = []
  for (const [targetId, { input }] of thread.nodes) {
    for (const targetName in input) {
      const value = input[targetName]

      // --- If the value is an array, iterate over each value and add the links.
      if (Array.isArray(value)) {
        for (const x of value) {
          if (!isLink(x)) continue
          links.push({ ...parseLink(x), targetId, targetName })
        }
      }

      // --- If the value is a map, iterate over each value and add the links.
      else if (typeof value === 'object' && value !== null && !isLink(value)) {
        for (const targetPath in value) {
          const x = (value as Record<string, unknown>)[targetPath]
          if (!isLink(x)) continue
          links.push({ ...parseLink(x), targetId, targetName, targetPath })
        }
      }

      // --- Otherwise, add the link if the value is a link.
      else if (isLink(value)) {
        links.push({ ...parseLink(value), targetId, targetName })
      }
    }
  }

  // --- Assert that each link is valid.
  for (const link of links) {
    if (!thread.nodes.has(link.sourceId))
      throw E.NODE_LINK_SOURCE_NOT_FOUND(link.targetId, link.targetName, link.sourceId)
  }

  // --- Return the links collected so far.
  return links
}
