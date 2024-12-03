import type { Thread } from '../thread'
import type { Link } from './types'
import { isReferenceLink } from './createReference'
import { resolveComponent } from './resolveComponent'
import { setComponentInstanceInputValue } from './setComponentInstanceInputValue'

function shouldRemove(value: unknown, linkToRemove: Partial<Link>): boolean {
  return isReferenceLink(value)
    && (linkToRemove.sourceId === undefined || value.$fromNode.id === linkToRemove.sourceId)
    && (linkToRemove.sourceName === undefined || value.$fromNode.name === linkToRemove.sourceName)
    && (linkToRemove.sourcePath === undefined || value.$fromNode.path === linkToRemove.sourcePath)
}

export interface RemoveLinkResult {
  id: string
  name: string
  value: unknown
}

/**
 * Unlink a node from another node. This removes the link between the source
 * and target node.
 *
 * If the source node is not specified, all links that are connected to the
 * target node are removed. If the target node is not specified, all links
 * that are connected to the source node are removed. Otherwise, only the
 * specific link between the source and target node is removed.
 *
 * @param thread The thread where the nodes are located.
 * @param linkToRemove The link to remove between the source and target node.
 * @returns An array of objects that describe which node and input was unlinked with their respective new value.
 * @example flow.removeLink({ sourceId: 'node-1', sourceKey: 'output', targetId: 'node-2', targetKey: 'input' })
 */
export async function removeLink(thread: Thread, linkToRemove: Partial<Link>): Promise<RemoveLinkResult[]> {
  const results: RemoveLinkResult[] = []
  for (const [id, componentInstance] of thread.componentInstances) {

    // --- Skip nodes that are not the source or target.
    if (linkToRemove.targetId && id !== linkToRemove.targetId) continue
    if (componentInstance.input === undefined) continue

    // --- Iterate over the input values of the node.
    for (const name in componentInstance.input) {
      if (linkToRemove.targetName && name !== linkToRemove.targetName) continue
      const component = await resolveComponent(componentInstance.kind, thread.componentResolvers)
      const value = componentInstance.input[name]
      const socket = component.inputSchema?.[name]

      // --- Remove values without sockets.
      if (!socket) {
        setComponentInstanceInputValue(thread, id, name, undefined)
        results.push({ id, name, value: undefined })
      }

      // --- Handle the case where the value is an array of links.
      else if (socket.isIterable && Array.isArray(value)) {
        const newValue = value.filter(value => !shouldRemove(value, linkToRemove))
        setComponentInstanceInputValue(thread, id, name, newValue)
        results.push({ id, name, value: newValue })
      }

      // --- Handle the case where the value is a map.
      else if (socket.isMap && typeof value === 'object' && value !== null && !isReferenceLink(value)) {
        const newValueEntries = Object.entries(value)
          .filter(([, value]) => !shouldRemove(value, linkToRemove))
          .map(([path, value]) => [path, value] as [string, unknown])
        const newValue = Object.fromEntries(newValueEntries)
        setComponentInstanceInputValue(thread, id, name, newValue)
        results.push({ id, name, value: newValue })
      }

      // --- Set the value to `undefined` if the source and target are specified.
      else {
        if (!shouldRemove(value, linkToRemove)) continue
        setComponentInstanceInputValue(thread, id, name, undefined)
        results.push({ id, name, value: undefined })
      }
    }
  }

  // --- Return the results of the removed links.
  return results
}
