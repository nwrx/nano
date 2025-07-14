import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const lmStudio = defineProvider({
  ...openaiCompatible,
  name: 'lm-studio',
  baseUrl: 'http://localhost:1234/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: false,
        default: process.env.LM_STUDIO_API_KEY,
      },
    },
  },
})
