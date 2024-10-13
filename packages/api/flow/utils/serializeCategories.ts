import type { Flow, Node } from '@nwrx/core'
import type { NodeJSON } from './serializeNode'
import { serializeNode } from './serializeNode'

/** The serialized representation of a flow category. */
export interface FlowCategoryNodesJSON {
  kind: string
  name?: string
  icon?: string
  description?: string
  nodes: NodeJSON[]
}

/**
 * Given a `Flow` object, returns a serialized version of it so that it can be
 * sent to the client without any circular references.
 *
 * @param flow The `Flow` object to serialize.
 * @returns The serialized version of the `Flow` object.
 */
export function serializeCategories(flow: Flow) {
  const categories: FlowCategoryNodesJSON[] = [{
    kind: 'uncategorized',
    name: 'Uncategorized',
    icon: 'https://api.iconify.design/carbon:unknown.svg',
    description: 'Uncategorized nodes',
    nodes: [],
  }]

  // --- Collect all the categories from the module nodes.
  for (const module of flow.modules) {
    if (!module.nodes) continue
    for (const node of Object.values(module.nodes)) {
      const nodeJson = serializeNode({ ...node, kind: `${module.kind}:${node.kind}` })

      // --- If the node has no category, add it to the uncategorized category.
      if (!nodeJson.categoryKind) {
        categories[0].nodes.push(serializeNode(nodeJson as Node))
        continue
      }

      // --- If the category already exists, add the node to the category.
      // --- Otherwise, create a new category and add the node to the category.
      const category = categories.find(c => c.kind === nodeJson.categoryKind)
      if (category) { category.nodes.push(nodeJson as Node) }
      else {
        categories.push({
          kind: nodeJson.categoryKind,
          name: nodeJson.categoryName,
          icon: nodeJson.categoryIcon,
          description: nodeJson.categoryDescription,
          nodes: [nodeJson],
        })
      }
    }
  }

  // --- Sort the categories by their kind.
  return categories
    .filter(c => c.nodes.length > 0)
    .sort((a, b) => a.kind.localeCompare(b.kind))
}
