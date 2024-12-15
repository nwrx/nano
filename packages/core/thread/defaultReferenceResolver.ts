import type { ReferenceType } from '../utils'
import type { Thread } from './createThread'
import { createTool } from '../utils'
import { getComponent } from './getComponent'
import { getInstance } from './getInstance'

export async function DEFAULT_REFERENCE_RESOLVER(this: Thread, type: ReferenceType, ...values: string[]) {

  // --- Resolve a reference to the result of a node.
  if (type === 'Nodes') {
    const [id, name] = values
    return this.nodes.get(id)?.result[name]
  }

  // --- Resolve a reference to a tool.
  if (type === 'Tools') {
    const [id] = values
    const instance = getInstance(this, id)
    const component = await getComponent(this, id)

    // --- Assert the component has `input` and `process` methods.
    if (typeof component.process !== 'function') return
    if (typeof component.inputs !== 'object') return

    return createTool({
      name: component.title ?? instance.specifier,
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
