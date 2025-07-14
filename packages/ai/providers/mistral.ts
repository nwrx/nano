import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const mistral = defineProvider({
  ...openaiCompatible,
  name: 'mistral',
  baseUrl: 'https://api.mistral.ai/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: false,
        default: process.env.MISTRAL_API_KEY,
      },
    },
  },
})
