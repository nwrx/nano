import type { NodeInstanceContext, Type } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { defineDataSchema } from '@nwrx/core'
import { defineResultSchema } from '@nwrx/core'
import { categoryBasic } from '../categories'
import { boolean, number, stream, string } from '../types'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type InputDataSchema = {
  name: string
  type: 'boolean' | 'number' | 'stream' | 'text'
  defaultValue?: boolean | number | string
  isOptional: boolean
}

export const nodeInput = defineNode({
  kind: 'core/input',
  name: 'Input',
  icon: 'https://api.iconify.design/carbon:arrow-down.svg',
  category: categoryBasic,
  description: 'A value generated from an entrypoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an input to the flow.',

  dataSchema: ({ data }: NodeInstanceContext) => {
    const { type } = data as InputDataSchema
    return defineDataSchema<InputDataSchema>({
      type: {
        name: 'Type',
        control: 'select',
        defaultValue: 'text',
        description: 'The type of the value.',
        type: string as Type<'boolean' | 'number' | 'stream' | 'text'>,
        options: [
          {
            value: 'text',
            label: 'Text',
            icon: 'https://api.iconify.design/carbon:text-long-paragraph.svg',
            description: 'A text value, such as a paragraph or a sentence.',
          },
          {
            value: 'number',
            label: 'Number',
            icon: 'https://api.iconify.design/character-whole-number.svg',
            description: 'A numerical value.',
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
      name: {
        type: string,
        name: 'Name',
        control: 'text',
        defaultValue: 'message',
        description: 'The name of the input property. This is the name that will be used to reference the input in the flow.',
      },
      defaultValue: {
        name: 'Default',
        control: { number: 'slider', boolean: 'checkbox', stream: 'stream', text: 'text' }[type ?? 'text'],
        type: { number, boolean, stream: string, text: string }[type ?? 'text'],
        description: 'The default value to use if no input is provided.',
        sliderMin: 0,
        sliderMax: 100,
        sliderStep: 1,
        isOptional: true,
      },
      isOptional: {
        name: 'Optional',
        type: boolean,
        control: 'radio',
        description: 'If checked, the input is optional and the flow will continue even if no value is provided.',
        defaultValue: false,
        options: [
          { value: true, label: 'Optional' },
          { value: false, label: 'Required' },
        ],
      },
    })
  },

  resultSchema: ({ data }) => defineResultSchema({
    value: {
      name: 'Value',
      type: { number, boolean, stream, text: string }[data.type],
      description: 'The value of the entrypoint.',
      isOptional: data.isOptional,
    },
  }),

  process: ({ data, result }) => ({
    value: result.value ?? data.defaultValue,
  }),
})
