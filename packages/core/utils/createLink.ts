import type { Thread } from '../thread'
import type { Link } from './types'
import { createReference, isReferenceLink } from './createReference'
import { getComponentInstance } from './getComponentInstance'
import { resolveComponent } from './resolveComponent'
import { setComponentInstanceInputValue } from './setComponentInstanceInputValue'

export interface CreateLinkResult {
  id: string
  name: string
  value: unknown
}

/**
 * Link the output of a node to the input of another node. When processing
 * the flow, the output of the source node is passed as input to the target
 * node.
 *
 * @param thread The thread where the nodes are located.
 * @param link The link to create between the source and target node.
 * @returns An object that describe which node and input was linked with the value.
 * @example flow.createLink({ sourceId: 'node-1', sourceKey: 'output', targetId: 'node-2', targetKey: 'input' })
 */
export async function createLink(thread: Thread, link: Link): Promise<CreateLinkResult> {

  const source = getComponentInstance(thread, link.sourceId)
  const sourceComponent = await resolveComponent(source.kind, thread.componentResolvers)
  const sourceSocket = sourceComponent.outputSchema?.[link.sourceName]

  const target = getComponentInstance(thread, link.targetId)
  const targetKind = await resolveComponent(target.kind, thread.componentResolvers)
  const targetSocket = targetKind.inputSchema?.[link.targetName]

  // --- Verify that the source and target can be linked.
  if (!target) throw new Error(`The target node "${link.targetId}" does not exist`)
  if (!source) throw new Error(`The source node "${link.sourceId}" does not exist`)
  if (!sourceSocket) throw new Error(`The source socket "${link.sourceName}" does not exist on node "${link.sourceId}"`)
  if (!targetSocket) throw new Error(`The target socket "${link.targetName}" does not exist on node "${link.targetId}"`)
  // if (sourceSocket.type !== targetSocket.type) throw new Error('Cannot link sockets of different types')
  if (link.sourceId === link.targetId) throw new Error('Cannot link a node to itself')

  // --- Compute the new value for the target socket.
  const reference = createReference('fromNode', { id: link.sourceId, name: link.sourceName })

  // --- If iterable, append the value to the target socket.
  if (targetSocket.isIterable) {
    const input = target.input ?? {}
    const value = input[link.targetName] ?? []
    const valueArray: unknown[] = Array.isArray(value) ? value : [value]
    const valueIsAlreadyLinked = valueArray.some(value =>
      isReferenceLink(value)
      && value.$fromNode.id === link.sourceId
      && value.$fromNode.name === link.sourceName
      && value.$fromNode.path === link.sourcePath)
    const newValue = valueIsAlreadyLinked ? [reference] : [...valueArray, reference]
    setComponentInstanceInputValue(thread, link.targetId, link.targetName, newValue)
    return { id: link.targetId, name: link.targetName, value: newValue }
  }

  // --- If map, set the value to the target at the given path.
  else if (link.targetPath) {
    const input = target.input ?? {}
    const value = input[link.targetName] ?? {}
    const newValue = { ...value, [link.targetPath]: reference }
    setComponentInstanceInputValue(thread, link.targetId, link.targetName, newValue)
    return { id: link.targetId, name: link.targetName, value: newValue }
  }

  // --- Otherwise, append the value to the target socket.
  setComponentInstanceInputValue(thread, link.targetId, link.targetName, reference)
  return { id: link.targetId, name: link.targetName, value: reference }
}
