import { defineComponent } from '../utils'

export const output = defineComponent({
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
      type: 'string',
      description: 'The value to send to the ouput.',
    },
  },
})
