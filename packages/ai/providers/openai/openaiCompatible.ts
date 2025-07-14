import { defineProvider } from '../../utils/defineProvider'
import { onRequestChat } from './onRequestChat'
import { onResponseChat } from './onResponseChat'
import { onResponseModels } from './onResponseModels'

export type OpenAICompatible = typeof openaiCompatible

/** OpenAI compatible provider. */
export const openaiCompatible = defineProvider({
  name: 'openai-compatible',
  baseUrl: 'https://api.openai.com/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.OPENAI_API_KEY,
      },
    },
  },
  chat: {
    path: '/chat/completions',
    onRequest: onRequestChat,
    onResponse: onResponseChat,
    parameters: {
      stream: {
        location: 'body',
        schema: { type: 'boolean', default: true },
      },
      modalities: {
        location: 'body',
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['text', 'image', 'audio'],
          },
        },
      },
    },
  },
  models: {
    path: '/models',
    onResponse: onResponseModels,
  },
} as const)
