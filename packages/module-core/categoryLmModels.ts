import { defineFlowCategory } from '@nwrx/core'

export const categoryLm = defineFlowCategory({
  kind: 'lm',
  name: 'Language Models',
  color: '#8B5CF6',
  icon: 'https://api.iconify.design/carbon:model.svg',
  description: 'A collection of nodes for working with language models.',
})
