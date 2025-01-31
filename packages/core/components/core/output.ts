import { defineComponent } from '../../utils/defineComponent'

export const output = defineComponent(
  {
    isTrusted: true,
    title: 'Output',
    icon: 'https://api.iconify.design/carbon:arrow-up.svg',
    description: 'Defines an an output of the flow.',
    inputs: {
      name: {
        'type': 'string',
        'name': 'Name',
        'default': 'Output',
        'description': 'The name of the output value.',
        'x-control': 'text',
      },
      description: {
        'type': 'string',
        'name': 'Description',
        'control': 'text',
        'description': 'A short description that explains the purpose of the output value.',
        'x-control': 'textarea',
        'x-optional': true,
      },
      value: {
        name: 'Value',
        description: 'The value to send to the ouput.',
        oneOf: [
          { 'x-type': 'stream' },
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  },
  ({ data, thread }) => {
    thread.output[data.name] = data.value
    thread.dispatch('output', data.name, data.value)
    return {}
  },
)
