import type { Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import * as YAML from 'yaml'
import { categoryBasic } from '../categories'
import { object, string } from '../types'

export const nodeParse = defineNode({
  kind: 'parse',
  name: 'Parse',
  icon: 'https://api.iconify.design/carbon:data-format.svg',
  description: 'This node parses a given string into an object. It supports both JSON and YAML formats, allowing users to specify the format of the input string. The parsed result is returned as a key-value map object.',
  category: categoryBasic,

  dataSchema: {
    format: {
      name: 'Format',
      type: string as Type<'auto' | 'json' | 'yaml'>,
      control: 'select',
      defaultValue: 'json',
      description: 'The format of the input string.',
      options: [
        {
          value: 'json',
          label: 'JSON',
          icon: 'https://api.iconify.design/carbon:code.svg',
          description: 'The input string is in JSON format.',
        },
        {
          value: 'yaml',
          label: 'YAML',
          icon: 'https://api.iconify.design/carbon:code.svg',
          description: 'The input is a YAML string.',
        },
      ],
    },
    input: {
      type: string,
      name: 'JSON',
      control: 'socket',
      description: 'The input string to parse. It can be either a JSON or YAML formatted string, depending on the selected format.',
    },
  },

  resultSchema: {
    object: {
      type: object,
      name: 'Object',
      description: 'The parsed JSON object as a key-value map.',
    },
  },

  process: ({ data }) => {
    const { format, input } = data
    if (format === 'yaml') return { object: YAML.parse(input) as Record<string, unknown> }
    return { object: JSON.parse(input) as Record<string, unknown> }
  },
})
