import { defineNode } from '@nwrx/core'
import { basic } from '../categories'
import { object, string } from '../types'

export const parseJson = defineNode({
  kind: 'parse',
  name: 'Parse',
  icon: 'https://api.iconify.design/carbon:json.svg',
  description: 'Parses a JSON string into an object.',
  category: basic,

  dataSchema: {
    json: {
      type: string,
      name: 'JSON',
      control: 'socket',
      description: 'The JSON string to parse.',
    },
  },

  resultSchema: {
    object: {
      type: object,
      name: 'Object',
      description: 'The parsed JSON object as a key-value map.',
    },
  },

  process: ({ data }) => ({
    object: JSON.parse(data.json) as Record<string, unknown>,
  }),
})
