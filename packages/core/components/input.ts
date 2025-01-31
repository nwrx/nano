import { defineComponent } from '../utils'

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
      isOptional: {
        'type': 'boolean',
        'title': 'Optional',
        'description': 'If checked, the input is optional and the flow will continue even if no value is provided.',
        'defaultValue': false,
        'x-optional': true,
        'x-control': 'select',
        'x-options': () => [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
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
  ({ data, result }) => {
    const { name, isOptional } = data
    const { value } = result
    if (!isOptional && !value) throw new Error(`The input "${name}" is required but no value was provided.`)
    return { value }
  },
)
