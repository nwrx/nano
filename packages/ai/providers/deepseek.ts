import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const deepseek = defineProvider({
  ...openaiCompatible,
  name: 'deepseek',
  baseUrl: 'https://api.deepseek.com/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.DEEPSEEK_API_KEY,
      },
    },
  },
})
