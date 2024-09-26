import type { FlowType } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { dedent } from '@unshared/string'
import { categoryBasic } from './categoryBasic'
import { typeBoolean } from './typeBoolean'
import { typeNumber } from './typeNumber'
import { typeStream } from './typeStream'
import { typeString } from './typeString'

export const nodeInput = defineFlowNode({
  kind: 'input',
  name: 'Input',
  icon: 'https://api.iconify.design/carbon:arrow-down.svg',
  category: categoryBasic,
  description: dedent(`
    A value generated from an entrypoint in the flow. The value can be
    any type of data, such as a string, number, or boolean and is provided
    as an input to the flow.
  `),

  defineDataSchema: {
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
    type: {
      name: 'Type',
      display: 'select',
      type: typeString as FlowType<'boolean' | 'number' | 'stream' | 'text'>,
      description: 'The type of the value.',
      disallowDynamic: true,
      values: {
        'Text': 'text',
        'Number': 'number',
        'Yes/No': 'boolean',
        'Stream': 'stream',
      },
    },
  },

  defineResultSchema: ({ data }) => {
    let type: FlowType<any> = typeString
    if (data.type === 'number') type = typeNumber
    else if (data.type === 'boolean') type = typeBoolean
    else if (data.type === 'stream') type = typeStream
    return {
      value: {
        name: 'Value',
        type,
        description: 'The value of the entrypoint.',
      },
    }
  },

  process: async({ flow, data, abortSignal }) =>
    await new Promise<{ value: unknown }>((resolve) => {

      // --- On abort, resolve with undefined.
      abortSignal.addEventListener('abort', () => {
        resolve({ value: undefined })
      })

      // --- On flow:input, resolve with the value.
      flow.on('flow:input', (property, value) => {
        if (property !== data.property) return
        resolve({ value })
      })
    }),
})
