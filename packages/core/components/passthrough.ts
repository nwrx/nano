import { defineComponent } from '../utils/defineComponent'

export const passthrough = defineComponent(
  {
    isTrusted: true,
    inputs: {
      value: {
        title: 'Value',
        description: 'The value to pass through the node.',
        oneOf: [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { 'x-type': 'stream' },
        ],
      },
    },
    outputs: {
      value: {
        title: 'Value',
        description: 'The value that was passed through the node.',
        oneOf: [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { 'x-type': 'stream' },
        ],
      },
    },
  },
  ({ data }) => ({
    value: data.value,
  }),
)
