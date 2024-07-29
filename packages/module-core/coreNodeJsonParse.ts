import { coreTypeString } from './coreTypeString'
import { coreTypeObject } from './coreTypeObject'
import { defineChainNode } from '../chain/defineChainNode'

export const coreNodeJsonParse = defineChainNode({
  name: 'core:json-parse',
  label: 'JSON Parse',
  icon: 'https://api.iconify.design/carbon:json.svg',
  description: 'Parses a JSON string into an object.',

  defineDataSchema: () => ({
    json: {
      name: 'JSON',
      type: coreTypeString,
    },
  }),

  defineResultSchema: () => ({
    object: {
      name: 'Object',
      type: coreTypeObject,
    },
  }),

  process: ({ data }) => {
    const { json } = data
    return { object: JSON.parse(json) as Record<string, unknown> }
  },
})
