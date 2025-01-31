import type { Link } from './addLink'
import type { Thread } from './createThread'
import { isLink, parseLink } from '../utils'
import { getInputSocket } from './getInputSocket'
import { getInputValue } from './getInputValue'
import { setInputValue } from './setInputValue'

export interface RemoveLinkResult {
  id: string
  name: string
  value: unknown
}

function shouldRemove(value: unknown, linkToRemove: Partial<Link>): boolean {
  if (!isLink(value)) return false
  const { sourceId, sourceName, sourcePath } = parseLink(value)
  return (linkToRemove.sourceId === undefined || sourceId === linkToRemove.sourceId)
    && (linkToRemove.sourceName === undefined || sourceName === linkToRemove.sourceName)
    && (linkToRemove.sourcePath === undefined || sourcePath === linkToRemove.sourcePath)
}

export async function removeLink(thread: Thread, linkToRemove: Partial<Link>): Promise<RemoveLinkResult[]> {
  const results: RemoveLinkResult[] = []
  for (const [id, componentInstance] of thread.componentInstances) {

    // --- Skip nodes that are not the source or target.
    if (linkToRemove.targetId && id !== linkToRemove.targetId) continue
    if (componentInstance.input === undefined) continue

    // --- Iterate over the input values of the node.
    for (const name in componentInstance.input) {
      if (linkToRemove.targetName !== undefined && name !== linkToRemove.targetName) continue
      const socket = await getInputSocket(thread, id, name)
      const value = await getInputValue(thread, id, name)

      if (shouldRemove(value, linkToRemove)) {
        setInputValue(thread, id, name, undefined)
        results.push({ id, name, value: undefined })
      }

      // --- Handle the case where the value is an array of links.
      else if (socket.type === 'array' && Array.isArray(value)) {
        const newValue = value.filter(value => !shouldRemove(value, linkToRemove))
        setInputValue(thread, id, name, newValue)
        results.push({ id, name, value: newValue })
      }

      // --- Handle the case where the value is a map.
      else if (socket.type === 'object' && typeof value === 'object' && value !== null) {
        const newValueEntries = Object.entries(value)
          .filter(([, value]) => !shouldRemove(value, linkToRemove))
          .map(([path, value]) => [path, value] as [string, unknown])
        const newValue = Object.fromEntries(newValueEntries)
        setInputValue(thread, id, name, newValue)
        results.push({ id, name, value: newValue })
      }
    }
  }

  // --- Return the results of the removed links.
  return results
}
