import type { NodeInstanceContext, Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { basic } from '../categories'
import { boolean, number, object, stream, string } from '../types'

export const nodeOutput = defineNode({
  kind: 'output',
  name: 'Output',
  icon: 'https://api.iconify.design/carbon:arrow-up.svg',
  category: basic,
  description: ' A value that is sent to an exitpoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an output from the flow.',

  dataSchema: ({ data }: NodeInstanceContext) => {
    let type = string as Type<unknown>
    if (data.type === 'number') type = number
    else if (data.type === 'boolean') type = boolean
    else if (data.type === 'stream') type = stream
    else if (data.type === 'object') type = object
    return {
      type: {
        type: string as Type<'boolean' | 'number' | 'object' | 'stream' | 'text'>,
        name: 'Type',
        control: 'select',
        description: 'The type of the value.',
        options: [
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
        ],
      },
      property: {
        type: string,
        name: 'Property',
        control: 'text',
        description: 'The property name to send the value to the exitpoint.',
      },
      value: {
        name: 'Value',
        type,
        control: 'socket',
        description: 'The value to send to the exitpoint.',
      },
    }
  },

  process: ({ flow, data }) => {
    flow.dispatch('flow:output', flow.run, data.property, data.value)
    return {}
  },
})
