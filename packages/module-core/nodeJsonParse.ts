import { defineFlowNode } from '@nanoworks/core'
import { typeObject } from './typeObject'
import { typeString } from './typeString'

export const nodeJsonParse = defineFlowNode({
  kind: 'json-parse',
  name: 'JSON Parse',
  icon: 'https://api.iconify.design/carbon:json.svg',
  description: 'Parses a JSON string into an object.',

  defineDataSchema: {
    json: {
      name: 'JSON',
      type: typeString,
    },
  },

  defineResultSchema: {
    object: {
      name: 'Object',
      type: typeObject,
    },
  },

  process: ({ data }) => {
    const { json = '{}' } = data
    return { object: JSON.parse(json) as Record<string, unknown> }
  },
})
