import { defineComponent } from '../utils/defineComponent'

export const input = defineComponent(
  {
    title: 'Input',
    icon: 'https://api.iconify.design/carbon:arrow-down.svg',
    description: 'A value generated from an entrypoint in the flow. The value can be any type of data, such as a string, number, or boolean and is provided as an input to the flow.',
    inputs: {
      name: {
        'type': 'string',
        'title': 'Name',
        'description': 'The name of the input property. This is the name that will be used to reference the input in the flow.',
        'x-control': 'text',
      },
      description: {
        'type': 'string',
        'title': 'Description',
        'description': 'A description of the input property. This is used to provide more information about the input and its purpose in the flow.',
        'x-optional': true,
        'x-control': 'text',
      },
      required: {
        'type': 'boolean',
        'title': 'Optional',
        'description': 'Whether the input is required to be provided in the flow. If set to true, the input will be required to be provided in the flow. If set to false, the input will be optional.',
        'defaultValue': false,
        'x-optional': true,
        'x-control': 'select',
        'oneOf': [
          {
            type: 'boolean',
            enum: [true] as const,
            title: 'Required',
            description: 'The input is required to be provided in the flow.',
          },
          {
            type: 'boolean',
            enum: [false] as const,
            title: 'Optional',
            description: 'The input is optional to be provided in the flow.',
          },
        ],
      },
    },
    outputs: {
      value: {
        name: 'Value',
        type: 'string',
        description: 'The value of the entrypoint.',
      },
    },
  },
)
