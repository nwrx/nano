import { defineComponent } from '../utils'

export const confirm = defineComponent(
  {
    title: 'Confirm',
    icon: 'https://api.iconify.design/mdi:check-circle-outline.svg',
    description: 'Ask for user confirmation and await the response. This will interrupt the flow until the user provides a response.',
    inputs: {
      question: {
        'type': 'string',
        'title': 'Question',
        'default': '',
        'description': 'The question to ask the user.',
        'x-placeholder': 'Are you sure?',
      },
      timeout: {
        type: 'number',
        title: 'Timeout',
        default: 0,
        description: 'The timeout in milliseconds before the response is considered invalid.',
      },
    },
    outputs: {
      response: {
        type: 'boolean',
        title: 'Response',
        description: 'The response from the user.',
      },
    },
  },
)
