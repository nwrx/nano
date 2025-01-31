import { defineDataSocket, defineNode, defineResultSocket } from '@nwrx/core'
import { basic } from '../categories'
import { object, string } from '../types'

export const parseJson = defineNode({
  kind: 'parse-json',
  name: 'Parse JSON',
  icon: 'https://api.iconify.design/carbon:json.svg',
  description: 'Parses a JSON string into an object.',
  category: basic,

  defineDataSchema: {
    json: defineDataSocket({
      type: string,
      name: 'JSON',
      control: 'socket',
      description: 'The JSON string to parse.',
    }),
  },

  defineResultSchema: {
    object: defineResultSocket({
      type: object,
      name: 'Object',
      description: 'The parsed JSON object as a key-value map.',
    }),
  },

  process: ({ data }) => {
    const { json = '{}' } = data
    return { object: JSON.parse(json) as Record<string, unknown> }
  },
})
