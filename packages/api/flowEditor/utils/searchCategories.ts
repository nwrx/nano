import type { ComponentJSON } from './serializeComponent'
import { components } from '@nwrx/nano/components'
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

  // --- Sort the categories by their kind.
  return categories
    .filter(c => c.components.length > 0)
    .sort((a, b) => a.kind.localeCompare(b.kind))
}
