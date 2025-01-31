import { defineModule } from '@nwrx/core'
import * as nodes from './nodes'
import { importFromPostmanCollection } from './openapi'

export const Core = defineModule({
  kind: 'core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: async() => ({
    ...nodes,

    // --- Notion.
    ...await importFromPostmanCollection('15568543-d990f9b7-98d3-47d3-9131-4866ab9c6df2', {
      kind: 'notion',
      name: 'Notion',
      color: '#4a154b',
      icon: 'https://api.iconify.design/simple-icons:notion.svg',
    }),

    // --- Gmail.
    ...await importFromPostmanCollection('35240-0d073c40-6ad8-43d0-8baf-8ee3606819e0', {
      kind: 'gmail',
      name: 'Gmail',
      color: '#d93025',
      icon: 'https://api.iconify.design/skill-icons:gmail-light.svg',
    }),
  }),
})
