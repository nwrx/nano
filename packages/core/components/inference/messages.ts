import type { LanguageModelMessage } from './utils'
import { defineTool, toolSchema } from '../../utils'
import { defineComponent } from '../../utils/defineComponent'
import { languageModelMessageSchema } from './utils'

export const messages = defineComponent(
  {
    isTrusted: true,
    isToolSet: true,
    inputs: {
      title: {
        'type': 'string',
        'title': 'Title',
        'description': 'The title of the messages collection.',
        'default': 'Messages',
        'x-control': 'text',
      },
      name: {
        'type': 'string',
        'title': 'Name',
        'pattern': '^[a-z0-9_]+$',
        'description': 'The name of the messages collection.',
        'x-optional': true,
        'x-control': 'text',
      },
      description: {
        'type': 'string',
        'title': 'Description',
        'description': 'A description of the messages collection.',
        'x-optional': true,
        'x-control': 'textarea',
      },
      messages: {
        type: 'array',
        title: 'Messages',
        description: 'The messages to interact with.',
        items: languageModelMessageSchema,
      },
    },
    outputs: {
      messages: {
        type: 'array',
        title: 'Messages',
        description: 'The messages to interact with.',
        items: languageModelMessageSchema,
      },
      tools: {
        type: 'object',
        title: 'Tools',
        description: 'The tools to interact with the messages.',
        properties: {
          push: {
            title: 'Push Message',
            description: 'Allows the LLM to push custom messages to the collection.',
            ...toolSchema,
          },
          summarize: {
            title: 'Summarize Message',
            description: 'Allows the LLM to summarize a message in the collection if the message is too long or verbose.',
            ...toolSchema,
          },
        },
      },
    },
  },
  ({ data, nodeId }) => ({
    messages: data.messages,
    tools: {
      push: defineTool(nodeId, {
        name: `message_push_to_${data.name}`,
        description: `Push a message to the ${data.name} collection.`,
        properties: {
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the message.',
            enum: ['user', 'assistant', 'system'],
            default: 'user',
          },
          content: {
            type: 'string',
            title: 'Content',
            description: 'The text of the message.',
            default: 'Hello, world!',
          },
        },
        call: (message: LanguageModelMessage) => {
          data.messages.push(message)
          return { ok: true }
        },
      }),
      summarize: defineTool(nodeId, {
        name: `message_summarize_${data.name}`,
        description: `Summarize the messages in the ${data.name} collection. Note that this tool will mutate the messages in place.`,
        properties: {
          index: {
            type: 'integer',
            title: 'Index',
            description: 'The index of the message to summarize.',
          },
          summary: {
            type: 'string',
            title: 'Summary',
            description: 'The summarization of the messages.',
          },
        },
        call: ({ index, summarization }: { index: number; summarization: string }) => {
          const message = data.messages[index]
          data.messages[index] = { ...message, content: summarization }
          return { done: true }
        },
      }),
    },
  }),
)
