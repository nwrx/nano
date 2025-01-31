import { defineComponent } from '../utils'

export const ask = defineComponent(
  {
    title: 'Ask',
    icon: 'https://api.iconify.design/mdi:comment-question-outline.svg',
    description: 'Ask for user input and await the response. This will interrupt the flow until the user provides a response.',
    inputs: {
      question: {
        'type': 'string',
        'title': 'Question',
        'default': '',
        'description': 'The question to ask the user.',
        'x-placeholder': 'What is your name?',
      },
      choices: {
        type: 'array',
        title: 'If provided, the response must be one of the following choices.',
        items: { type: 'string' },
        description: 'The choices for the response.',
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
        type: 'string',
        title: 'Response',
        description: 'The response from the user.',
      },
    },
  },
)
