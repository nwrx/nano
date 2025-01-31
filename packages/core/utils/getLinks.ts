import type { Thread } from '../thread'
import type { Link } from './types'
import { isReferenceLink } from './createReference'

/**
 * Get all the links between the nodes in the flow. This function iterates over
 * all the nodes in the flow and collects the links between the nodes. If a node
 * has a property that is a string that matches the expected format of a link,
 * the link is added to the list of links.
 *
 * @param thread The thread where the nodes are located.
 * @returns The list of links between the nodes in the flow.
 * @example
 *
 * // Create a new flow instance with interconnected nodes.
 * const flow = new Flow()
 * const node1 = flow.createNode({ id: 'node1', ... })
 * const node2 = flow.createNode({ id: 'node2', input: { input: '$NODE.node1:output' } })
 * const node3 = flow.createNode({ id: 'node3', input: { input: ['$NODE.node1:output', '$NODE.node2:output'] } })
 *
 * // Get all the links between the nodes in the flow.
 * const links = flow.getLinks()
 * // => [
 * //   { sourceId: 'node1', sourceKey: 'output', targetId: 'node2', targetKey: 'input' },
 * //   { sourceId: 'node1', sourceKey: 'output', targetId: 'node3', targetKey: 'input' },
 * //   { sourceId: 'node2', sourceKey: 'output', targetId: 'node3', targetKey: 'input' },
 * // ]
 */
export function getLinks(thread: Thread): Link[] {
  const links: Link[] = []
  for (const [id, componentInstance] of thread.componentInstances) {
    for (const name in componentInstance.input) {
      const value = componentInstance.input[name]

      // --- If the value is an array, iterate over each value and add the links.
      if (Array.isArray(value)) {
        for (const x of value) {
          if (!isReferenceLink(x)) continue
          links.push({
            sourceId: x.$fromNode.id,
            sourceName: x.$fromNode.name,
            sourcePath: x.$fromNode.path,
            targetId: id,
            targetName: name,
          })
        }
      }

      // --- If the value is a map, iterate over each value and add the links.
      else if (typeof value === 'object' && value !== null && !isReferenceLink(value)) {
        for (const path in value) {
          const x = (value as Record<string, unknown>)[path]
          if (!isReferenceLink(x)) continue
          links.push({
            sourceId: x.$fromNode.id,
            sourceName: x.$fromNode.name,
            sourcePath: x.$fromNode.path,
            targetId: id,
            targetName: name,
            targetPath: path,
          })
        }
      }

      // --- Otherwise, add the link if the value is a link.
      else if (isReferenceLink(value)) {
        links.push({
          sourceId: value.$fromNode.id,
          sourceName: value.$fromNode.name,
          sourcePath: value.$fromNode.path,
          targetId: id,
          targetName: name,
        })
      }
    }
  }

  // --- Return the links collected so far.
  return links
}
