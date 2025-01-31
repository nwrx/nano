import { defineComponent } from '../../utils/defineComponent'
import { askQuestion } from './utils/askQuestion'

export const ask = defineComponent(
  {
    isTrusted: true,
    title: 'Ask',
    icon: 'https://api.iconify.design/mdi:comment-question-outline.svg',
    description: 'Ask for user input and await the response. This will interrupt the flow until the user provides a response.',
    inputs: {
      question: {
        type: 'string',
        title: 'Question',
        description: 'The question to ask the user.',
        example: 'What is your name?',
      },
      text: {
        'type': 'string',
        'title': 'Text',
        'description': 'The text to display to the user.',
        'x-optional': true,
        'x-control': 'textarea',
      },
      choices: {
        'type': 'array',
        'title': 'If provided, the response must be one of the following choices.',
        'description': 'The choices for the response.',
        'x-optional': true,
        'items': {
          type: 'object',
          required: ['value', 'label'],
          additionalProperties: false,
          properties: {
            value: {
              title: 'Value',
              description: 'The value of the choice.',
              oneOf: [
                { type: 'array' },
                { type: 'object' },
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
            label: {
              type: 'string',
              title: 'Label',
              description: 'The label for the choice.',
            },
            description: {
              type: 'string',
              title: 'Description',
              description: 'A description of the choice.',
            },
            icon: {
              type: 'string',
              title: 'Icon',
              description: 'The icon for the choice.',
            },
            imageUrl: {
              type: 'string',
              title: 'Image URL',
              description: 'The image URL for the choice.',
            },
          },
        },
      },
      defaultValue: {
        'title': 'Default Value',
        'description': 'The default value for the response.',
        'x-optional': true,
        'oneOf': [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
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
        title: 'Response',
        description: 'The response from the user.',
        oneOf: [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  },
  async({ data, thread, nodeId }) => ({
    response: await askQuestion(thread, nodeId, {
      question: data.question,
      text: data.text,
      choices: data.choices,
      timeout: data.timeout,
      defaultValue: data.defaultValue,
    }),
  }),
)
