import type { Thread } from '../thread'
import type { ReferenceType } from './createReference'
import { getNode, getNodeComponent } from '../thread'
import { createTool } from './createTool'
import { serializeSpecifier } from './serializeSpecifier'

export async function DEFAULT_REFERENCE_RESOLVER(this: Thread, type: ReferenceType, ...values: string[]) {

  // --- Resolve a reference to the result of a node.
  if (type === 'Nodes') {
    const [id, name] = values
    return getNode(this, id).result[name]
  }

  // --- Resolve a reference to a tool.
  if (type === 'Tools') {
    const [id] = values
    const node = getNode(this, id)
    const component = await getNodeComponent(this, id)

    // --- Assert the component has `input` and `process` methods.
    if (typeof component.process !== 'function') return
    if (typeof component.inputs !== 'object') return

    return createTool({
      name: component.title ?? serializeSpecifier(node),
      description: component.description ?? '',
      schema: {
        type: 'object',
        properties: component.inputs,
        required: Object.entries(component.inputs)
          .filter(([,property]) => property['x-optional'] !== true)
          .map(([name]) => name),
      },
      // @ts-expect-error: Ignore deep inference issue.
      call: context => component.process(context),
    })
  }
}
