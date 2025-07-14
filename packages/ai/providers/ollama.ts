import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const ollama = defineProvider({
  ...openaiCompatible,
  name: 'ollama',
  baseUrl: 'http://localhost:11434/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.OLLAMA_API_KEY,
      },
    },
  },
})
