import { defineFlowNode } from '@nwrx/core'
import { object, string } from '../types'

export const parseJson = defineFlowNode({
  kind: 'parse-json',
  name: 'Parse JSON',
  icon: 'https://api.iconify.design/carbon:json.svg',
  description: 'Parses a JSON string into an object.',

  defineDataSchema: {
    json: {
      name: 'JSON',
      type: string,
      defaultValue: '{}',
      description: 'The JSON string to parse.',
    },
  },

  defineResultSchema: {
    object: {
      name: 'Object',
      type: object,
      description: 'The parsed JSON object as a key-value map.',
    },
  },

  process: ({ data }) => {
    const { json = '{}' } = data
    return { object: JSON.parse(json) as Record<string, unknown> }
  },
})
