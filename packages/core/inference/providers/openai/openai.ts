import { defineProviderOptions } from '../../utils/defineProviderOptions'
import { onRequest } from './onRequest'
import { onResponse } from './onResponse'

export const openai = defineProviderOptions({
  name: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  features: {
    textGeneration: {
      path: '/chat/completions',
      onRequest,
      onResponse,
      parameters: [
        {
          name: 'stream',
          path: 'stream',
          location: 'body',
          schema: { type: 'boolean', default: true },
        },
        {
          name: 'modalities',
          path: 'modalities',
          location: 'body',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['text', 'image', 'audio'],
            },
          },
        },
      ],
    },
    searchModels: {
      path: '/models',
    },
  },
  parameters: [
    {
      name: 'apiKey',
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.OPENAI_API_KEY,
      },
    },
  ],
})
