import { defineFlowCategory } from '@nanoworks/core'

export const categoryLmModels = defineFlowCategory({
  kind: 'lm-models',
  name: 'Language Models',
  icon: 'https://api.iconify.design/carbon:model.svg',
  description: 'A collection of nodes for working with language models.',
})
