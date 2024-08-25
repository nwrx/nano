import type { FlowType } from '@nanoworks/core'
import { defineFlowNode } from '@nanoworks/core'
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

  defineDataSchema: ({ data }: { data: Record<string, FlowType> }) => ({
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
        'Object': typeObject,
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
      type: data.type ?? typeString,
      description: 'The value to send to the exitpoint.',
    },
  }),

  defineResultSchema: {},

  process: ({ flow, data }) => {
    if (!data.value) return
    if (!data.property) return
    flow.dispatch('flow:output', { property: data.property, value: data.value })
  },
})
