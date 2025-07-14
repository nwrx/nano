import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const groq = defineProvider({
  ...openaiCompatible,
  name: 'groq',
  baseUrl: 'https://api.groq.com/openai/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.GROQ_API_KEY,
      },
    },
  },
})
