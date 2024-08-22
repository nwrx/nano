import type { FlowType } from '@nanoworks/core'
import { defineFlowNode } from '@nanoworks/core'
import { dedent } from '@unshared/string'
import { categoryBasic } from './categoryBasic'
import { typeBoolean } from './typeBoolean'
import { typeNumber } from './typeNumber'
import { typeObject } from './typeObject'
import { typeStream } from './typeStream'
import { typeString } from './typeString'

export const nodeInput = defineFlowNode({
  kind: 'input',
  name: 'Input',
  icon: 'https://api.iconify.design/carbon:arrow-right.svg',
  category: categoryBasic,
  description: dedent(`
    A value generated from an entrypoint in the flow. The value can be
    any type of data, such as a string, number, or boolean and is provided
    as an input to the flow.
  `),

  defineDataSchema: {
    type: {
      name: 'Type',
      display: 'select',
      type: typeObject as unknown as FlowType<FlowType>,
      description: 'The type of the value.',
      disallowDynamic: true,
      values: {
        'Text': typeString,
        'Number': typeNumber,
        'Yes/No': typeBoolean,
        'Stream': typeStream,
      },
    },
    property: {
      name: 'Property',
      display: 'text',
      type: typeString,
      disallowDynamic: true,
      description: dedent(`
        The name of the entrypoint. It is used to identify the property
        to get the value from the input data.
      `),
    },
    origin: {
      name: 'Origin',
      display: 'select',
      type: typeString as FlowType<'any' | 'http' | 'ws'>,
      description: 'The origin of the entrypoint.',
      disallowDynamic: true,
      values: {
        'Any': 'any',
        'HTTP Request': 'http',
        'WebSocket Message': 'ws',
      },
    },
  },

  defineResultSchema: ({ data }) => ({
    value: {
      name: 'Value',
      type: data.type ?? typeString,
      description: 'The value of the entrypoint.',
    },
  }),

  process: ({ flow, data }) => {
    flow.on('flow:input', ({ property }) => {
      if (property !== data.property) return

    })
  },
})
