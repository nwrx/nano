import type { NodeInstanceContext, Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { defineDataSchema } from '@nwrx/core'
import { categoryBasic } from '../categories'
import { boolean, number, object, stream, string } from '../types'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type OutputDataSchema = {
  name: string
  type: 'boolean' | 'number' | 'object' | 'stream' | 'text'
  value?: any
}

export const nodeOutput = defineNode({
  kind: 'output',
  name: 'Output',
  icon: 'https://api.iconify.design/carbon:arrow-up.svg',
  category: categoryBasic,
  description: ' A value that is sent to an exitpoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an output from the flow.',

  dataSchema: ({ data }: NodeInstanceContext) => {
    const { type } = data as OutputDataSchema
    return defineDataSchema<OutputDataSchema>({
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
            icon: 'https://api.iconify.design/carbon:character-whole-number.svg',
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
      name: {
        type: string,
        name: 'Name',
        control: 'text',
        description: 'The property name to send the value to the exitpoint.',
      },
      value: {
        name: 'Value',
        type: { number, boolean, stream, object, text: string }[type] ?? string,
        control: 'socket',
        description: 'The value to send to the exitpoint.',
        isOptional: true,
      },
    })
  },
})
