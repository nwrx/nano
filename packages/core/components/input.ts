import { defineComponent } from '../utils/defineComponent'

export const input = defineComponent(
  {
    isTrusted: true,
    inputs: {
      name: {
        'type': 'string',
        'title': 'Name',
        'description': 'The name of the input property. This is the name that will be used to reference the input in the flow.',
        'x-control': 'text',
        'example': 'Give your input a name',
      },
      description: {
        'type': 'string',
        'title': 'Description',
        'description': 'A description of the input property. This is used to provide more information about the input and its purpose in the flow.',
        'x-optional': true,
        'x-control': 'textarea',
        'example': 'Describe the input property',
      },
      required: {
        'type': 'boolean',
        'title': 'Optional',
        'description': 'Whether the input is required to be provided in the flow. If set to true, the input will be required to be provided in the flow. If set to false, the input will be optional.',
        'default': false,
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
        'type': 'string',
        'name': 'Value',
        'description': 'The value of the entrypoint.',
        'x-optional': true,
      },
    },
  },
  ({ data, thread }) => {
    const { name, required } = data

    const value = thread.input[name]
    if (required && value === undefined)
      throw new Error(`Input "${name}" is required but not provided.`)

    if (value instanceof ReadableStream)
      throw new Error(`Input "${name}" is a stream and cannot be used as an input.`)

    if (value instanceof File)
      throw new Error(`Input "${name}" is a file and cannot be used as an input'`)

    return {
      value: value === undefined
        ? undefined
        : String(value),
    }
  },
)
