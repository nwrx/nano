import { defineCategory } from '@nwrx/core'

export const categoryStorage = defineCategory({
  kind: 'storage',
  name: 'Storage',
  color: '#CC7000',
  icon: 'https://api.iconify.design/carbon:datastore.svg',
  description: 'A collection of nodes for working with storage services and databases.',
})

export const categoryText = defineCategory({
  kind: 'text',
  name: 'Text Manipulation',
  color: '#97531C',
  icon: 'https://api.iconify.design/carbon:text.svg',
  description: 'A collection of nodes for working with text and strings.',
})

export const categoryLogic = defineCategory({
  kind: 'logic',
  name: 'Logic',
  color: '#2A9D8F',
  icon: 'https://api.iconify.design/carbon:logic-gates.svg',
  description: 'A collection of nodes for working with logical operations.',
})
