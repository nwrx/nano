import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const perplexity = defineProvider({
  ...openaiCompatible,
  name: 'perplexity',
  baseUrl: 'https://api.perplexity.ai',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.PERPLEXITY_API_KEY,
      },
    },
  },
})
