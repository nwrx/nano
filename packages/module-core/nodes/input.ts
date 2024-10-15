import type { Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { basic } from '../categories'
import { boolean, number, stream, string } from '../types'

export const input = defineNode({
  kind: 'input',
  name: 'Input',
  icon: 'https://api.iconify.design/carbon:arrow-down.svg',
  category: basic,
  description: 'A value generated from an entrypoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an input to the flow.',

  dataSchema: {
    property: {
      type: string,
      name: 'Property',
      control: 'text',
      description: 'The name of the entrypoint. It is used to identify the property to get the value from the input data.',
    },
    type: {
      name: 'Type',
      control: 'select',
      type: string as Type<'boolean' | 'number' | 'stream' | 'text'>,
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
      ],
    },
  },

  resultSchema: ({ data }) => ({
    value: {
      name: 'Value',
      type: { number, boolean, stream, text: string }[data.type ?? 'text'],
      description: 'The value of the entrypoint.',
    },
  }),

  process: async({ flow, data, abortSignal }) =>
    await new Promise<{ value: unknown }>((resolve, reject) => {

      // --- If no data was provided within 1 second, reject.
      setTimeout(() => reject(new Error('No data provided.')), 1000)

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
