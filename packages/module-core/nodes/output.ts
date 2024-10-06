import type { FlowNodeContext, FlowNodePortValue, FlowType } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { basic } from '../categories'
import { boolean, number, object, stream, string } from '../types'

export const nodeOutput = defineFlowNode({
  kind: 'output',
  name: 'Output',
  icon: 'https://api.iconify.design/carbon:arrow-up.svg',
  category: basic,
  description: ' A value that is sent to an exitpoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an output from the flow.',

  defineDataSchema: ({ data }: FlowNodeContext) => {
    let type = string as FlowType<unknown>
    if (data.type === 'number') type = number
    else if (data.type === 'boolean') type = boolean
    else if (data.type === 'stream') type = stream
    else if (data.type === 'object') type = object
    return {
      type: {
        name: 'Type',
        display: 'select',
        type: string as FlowType<'boolean' | 'number' | 'stream' | 'text'>,
        description: 'The type of the value.',
        disallowDynamic: true,
        values: [
          {
            value: 'text',
            label: 'Text',
            icon: 'https://api.iconify.design/carbon:text-long-paragraph.svg',
            description: 'A text value, such as a string or a paragraph of text.',
          },
          {
            value: 'number',
            label: 'Number',
            icon: 'https://api.iconify.design/character-whole-number.svg',
            description: 'A numerical value, such as an integer or a decimal number.',
          },
          {
            value: 'boolean',
            label: 'Yes/No',
            icon: 'https://api.iconify.design/carbon:checkmark-outline.svg',
            description: 'A boolean value, such as true or false.',
          },
          {
            value: 'stream',
            label: 'Stream',
            icon: 'https://api.iconify.design/carbon:data-1.svg',
            description: 'A stream of data, such as an audio or video stream.',
          },
          {
            value: 'object',
            label: 'Object',
            icon: 'https://api.iconify.design/carbon:json.svg',
            description: 'An object value, such as a key-value map.',
          },
        ] satisfies FlowNodePortValue[],
      },
      property: {
        name: 'Property',
        display: 'text',
        type: string,
        disallowDynamic: true,
        description: 'The property name to send the value to the exitpoint.',
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
    if (!data.property) throw new Error('The property name is required.')
    flow.dispatch('flow:output', data.property, data.value)
  },
})
