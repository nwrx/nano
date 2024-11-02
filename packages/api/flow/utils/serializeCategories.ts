/* eslint-disable sonarjs/todo-tag */
import type { Node } from '@nwrx/core'
import type { NodeJSON } from './serializeNode'
import { Core } from '@nwrx/module-core'
import { Openai } from '@nwrx/module-openai'
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
 * The modules that can be used to build a flow.
 *
 * TODO: This should be dynamically loaded from module registry.
 */
const MODULES = [
  Openai,
  Core,
]

/**
 * Given a `Flow` object, returns a serialized version of it so that it can be
 * sent to the client without any circular references.
 *
 * @returns The serialized version of the `Flow` object.
 */
export function serializeCategories() {
  const categories: FlowCategoryNodesJSON[] = [{
    kind: 'uncategorized',
    name: 'Uncategorized',
    icon: 'https://api.iconify.design/carbon:unknown.svg',
    description: 'Uncategorized nodes',
    nodes: [],
  }]

  // --- Collect all the categories from the module nodes.
  for (const module of MODULES) {
    if (!module.nodes) continue
    for (const key in module.nodes) {
      const node = module.nodes[key]
      const nodeJson = serializeNode(node as Node)

      // --- If the node has no category, add it to the uncategorized category.
      if (!nodeJson.categoryKind) {
        categories[0].nodes.push(serializeNode(nodeJson as Node))
        continue
      }

      // --- If the category already exists, add the node to the category.
      // --- Otherwise, create a new category and add the node to the category.
      const category = categories.find(c => c.kind === nodeJson.categoryKind)
      if (category) { category.nodes.push(nodeJson) }
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
