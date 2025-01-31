import type { FlowNodeContext, FlowType } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { dedent } from '@unshared/string'
import { categoryBasic } from './categoryBasic'
import { typeBoolean } from './typeBoolean'
import { typeNumber } from './typeNumber'
import { typeObject } from './typeObject'
import { typeStream } from './typeStream'
import { typeString } from './typeString'

export const nodeOutput = defineFlowNode({
  kind: 'output',
  name: 'Output',
  icon: 'https://api.iconify.design/carbon:arrow-up.svg',
  category: categoryBasic,
  description: dedent(`
    A value that is sent to an exitpoint in the flow. The value can be
    any type of data, such as a string, number, or boolean and is provided
    as an output from the flow.
  `),

  defineDataSchema: ({ data }: FlowNodeContext) => {
    let type = typeString as FlowType<unknown>
    if (data.type === 'number') type = typeNumber
    else if (data.type === 'boolean') type = typeBoolean
    else if (data.type === 'stream') type = typeStream
    else if (data.type === 'object') type = typeObject

    return {
      type: {
        name: 'Type',
        display: 'select',
        type: typeString,
        description: 'The type of the value.',
        disallowDynamic: true,
        values: {
          'Text': 'text',
          'Number': 'number',
          'Yes/No': 'boolean',
          'Stream': 'stream',
          'Object': 'object',
        },
      },
      property: {
        name: 'Property',
        display: 'text',
        type: typeString,
        disallowDynamic: true,
        description: dedent(`
          The name of the exitpoint. It is used to identify the property
          to set the value in the output data.
        `),
      },
      value: {
        name: 'Value',
        type,
        description: 'The value to send to the exitpoint.',
      },
    }
  },

  process: ({ flow, data }) => {
    if (!data.value) return
    if (!data.property) return
    flow.dispatch('flow:output', data.property, data.value)
  },
})
