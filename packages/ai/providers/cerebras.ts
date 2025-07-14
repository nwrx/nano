import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const cerebras = defineProvider({
  ...openaiCompatible,
  name: 'cerebras',
  baseUrl: 'https://api.cerebras.ai/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.CEREBRAS_API_KEY,
      },
    },
  },
})
