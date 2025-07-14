import { defineComponent } from '../utils/defineComponent'

export const message = defineComponent(
  {
    inputs: {
      role: {
        'title': 'Role',
        'description': 'The role of the message.',
        'type': 'string',
        'enum': [
          'user',
          'assistant',
          'system',
          'tool',
        ],
        'x-enum-labels': [
          'User',
          'Assistant',
          'System',
          'Tool',
        ],
        'x-enum-icons': [
          'i-mdi-account',
          'i-mdi-robot',
          'i-mdi-shield-account',
          'i-mdi-cog',
        ],
      },
      content: {
        title: 'Content',
        description: 'The content of the message.',
        type: 'array',
        items: {
          oneOf: [
            { type: 'string' },
            { type: 'boolean' },
            { type: 'number' },
            { 'x-type': 'file' },
          ],
        },
      },
    },
    outputs: {
      message: {
        type: 'object',
        additionalProperties: true,
      },
    },
  },
  ({ data }) => ({
    message: {
      role: data.role,
      content: data.content,
    },
  }),
)
