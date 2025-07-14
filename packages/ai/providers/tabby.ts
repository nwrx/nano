import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const tabby = defineProvider({
  ...openaiCompatible,
  name: 'tabby',
  baseUrl: 'http://localhost:5000/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.TABBY_API_KEY,
      },
    },
  },
})
