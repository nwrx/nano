import type { ObjectLike } from '@unshared/types'
import type { Thread } from '../thread'
import type { ReferenceType } from './createReference'
import { toKebabCase } from '@unshared/string'
import { defineLanguageModelTool } from '../components'
import { getNode, getNodeComponent, getNodeOutputSocket, startNode } from '../thread'
import { ERRORS as E } from './errors'

export async function DEFAULT_REFERENCE_RESOLVER(this: Thread, type: ReferenceType, ...values: string[]) {
  if (type !== 'Nodes') return
  const [sourceId, name] = values
  const node = getNode(this, sourceId)

  // --- If name is provided, it is a reference to a result property.
  if (name) {
    if (node.state !== 'done') throw E.REFERENCE_TO_PENDING_NODE(sourceId)
    await getNodeOutputSocket(this, sourceId, name)
    return node.result[name]
  }

  // --- If name is not provided, it is a reference to a tool.
  else {
    const component = await getNodeComponent(this, sourceId)
    if (typeof component.process !== 'function')
      throw E.REFERENCE_TO_TOOL_BUT_NO_PROCESS_FUNCTION(sourceId)
    return defineLanguageModelTool({
      nodeId: sourceId,
      name: component.title ? toKebabCase(component.title) : sourceId,
      description: component.description ?? '',
      properties: component.inputs ?? {},
      call: (data: ObjectLike) => startNode(this, sourceId, data),
    })
  }
}
