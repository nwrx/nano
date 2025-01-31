import type { Thread } from './createThread'
import { createReference, isReference, parseReference } from '../utils'
import { getInputSocket } from './getInputSocket'
import { getInstance } from './getInstance'
import { setInputValue } from './setInputValue'

/** The object representation of a link between two nodes in the flow. */
export interface Link {
  sourceId: string
  sourceName: string
  sourcePath?: string
  targetId: string
  targetName: string
  targetPath?: string
}

/** The result of creating a link between two nodes in the flow. */
export interface CreateLinkResult {
  id: string
  name: string
  value: unknown
}

export async function addLink(thread: Thread, link: Link): Promise<CreateLinkResult> {
  if (link.sourceId === link.targetId) throw new Error('Cannot link a node to itself')

  // --- Compute the new value for the target socket.
  const target = getInstance(thread, link.targetId)
  const targetSocket = await getInputSocket(thread, link.targetId, link.targetName)
  const reference = createReference('Nodes', link.sourceId, link.sourceName, link.sourcePath)

  // --- If iterable, append the value to the target socket.
  if (targetSocket.type === 'array') {
    const input = target.input ?? {}
    const value = input[link.targetName] ?? []
    const valueArray: unknown[] = Array.isArray(value) ? value : [value]
    const valueIsAlreadyLinked = valueArray.some((value) => {
      if (!isReference(value)) return false
      const [refType, ...parts] = parseReference(value)
      if (refType !== 'Nodes') return false
      const [sourceId, sourceName, sourcePath] = parts
      return sourceId === link.sourceId && sourceName === link.sourceName && sourcePath === link.sourcePath
    })
    const newValue = valueIsAlreadyLinked ? [reference] : [...valueArray, reference]
    setInputValue(thread, link.targetId, link.targetName, newValue)
    return { id: link.targetId, name: link.targetName, value: newValue }
  }

  // --- If map, set the value to the target at the given path.
  else if (targetSocket.type === 'object' && link.targetPath) {
    const input = target.input ?? {}
    const value = input[link.targetName] ?? {}
    const newValue = { ...value, [link.targetPath]: reference }
    setInputValue(thread, link.targetId, link.targetName, newValue)
    return { id: link.targetId, name: link.targetName, value: newValue }
  }

  // --- Otherwise, append the value to the target socket.
  setInputValue(thread, link.targetId, link.targetName, reference)
  return { id: link.targetId, name: link.targetName, value: reference }
}
