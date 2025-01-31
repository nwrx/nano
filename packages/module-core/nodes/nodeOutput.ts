import { defineComponent, NODE_OUTPUT_KIND } from '@nwrx/nano'
import { categoryBasic } from '../categories'
import { string } from '../types'

export const nodeOutput = defineComponent({
  kind: NODE_OUTPUT_KIND,
  name: 'Output',
  icon: 'https://api.iconify.design/carbon:arrow-up.svg',
  category: categoryBasic,
  description: 'Defines an an output of the flow.',

  inputSchema: {
    name: {
      type: string,
      name: 'Name',
      control: 'text',
      description: 'The name of the output value.',
    },
    description: {
      type: string,
      name: 'Description',
      control: 'text',
      description: 'A short description that explains the purpose of the output value.',
      isOptional: true,
    },
    value: {
      name: 'Value',
      type: string,
      control: 'socket',
      description: 'The value to send to the ouput.',
      isOptional: true,
    },
  },
})
