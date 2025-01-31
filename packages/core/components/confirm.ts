import { defineComponent } from '../utils/defineComponent'

export const confirm = defineComponent(
  {
    isTrusted: true,
    title: 'Confirm',
    icon: 'https://api.iconify.design/mdi:check-circle-outline.svg',
    description: 'Ask for user confirmation and await the response. This will interrupt the flow until the user provides a response.',
    inputs: {
      question: {
        'type': 'string',
        'title': 'Question',
        'description': 'The question to ask the user.',
        'x-placeholder': 'Are you sure?',
      },
      text: {
        'type': 'string',
        'title': 'Text',
        'description': 'The text to display to the user.',
        'x-optional': true,
        'x-control': 'textarea',
      },
      timeout: {
        'type': 'integer',
        'title': 'Timeout',
        'minimum': 0,
        'description': 'The timeout in milliseconds before the response is considered invalid.',
        'x-optional': true,
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
  async({ data, askConfirmation }) => ({
    response: await askConfirmation({
      question: data.question,
      text: data.text,
      timeout: data.timeout,
    }),
  }),
)
