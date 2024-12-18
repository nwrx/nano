import { defineComponent } from '../utils/defineComponent'

export const passthrough = defineComponent(
  {
    title: 'Passthrough',
    icon: 'https://api.iconify.design/carbon:arrow-right.svg',
    description: 'A value that is passed through the flow without modification. Use for debugging purposes.',
    inputs: {
      value: {
        title: 'Value',
        description: 'The value to pass through the node.',
      },
    },
    outputs: {
      value: {
        title: 'Value',
        description: 'The value that was passed through the node.',
      },
    },
  },
  ({ data }) => ({ value: data.value }),
)
