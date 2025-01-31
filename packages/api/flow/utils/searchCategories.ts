import type { ComponentJSON } from './serializeComponent'
import { getModuleNodes } from '@nwrx/nano'
import { serializeComponent } from './serializeComponent'

export interface CategoryJSON {
  kind: string
  name?: string
  icon?: string
  description?: string
  components: ComponentJSON[]
}

export async function searchCategories() {
  const categories: CategoryJSON[] = [{
    kind: 'uncategorized',
    name: 'Uncategorized',
    icon: 'https://api.iconify.design/carbon:unknown.svg',
    description: 'Uncategorized nodes',
    components: [],
  }]

  // --- Collect all the categories from the module nodes.
  for (const module of MODULES) {
    if (!module.nodes) continue
    const nodes = await getModuleNodes(module, '')
    for (const node of nodes) {
      const nodeJson = serializeComponent(node)

      // --- If the node has no category, add it to the uncategorized category.
      if (!nodeJson.categoryKind) {
        categories[0].components.push(nodeJson)
        continue
      }

      // --- If the category already exists, add the node to the category.
      // --- Otherwise, create a new category and add the node to the category.
      const category = categories.find(c => c.kind === nodeJson.categoryKind)
      if (category) { category.components.push(nodeJson) }
      else {
        categories.push({
          kind: nodeJson.categoryKind,
          name: nodeJson.categoryName,
          icon: nodeJson.categoryIcon,
          description: nodeJson.categoryDescription,
          components: [nodeJson],
        })
      }
    }
  }

  // --- Sort the categories by their kind.
  return categories
    .filter(c => c.components.length > 0)
    .sort((a, b) => a.kind.localeCompare(b.kind))
}
