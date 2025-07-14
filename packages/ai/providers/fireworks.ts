import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const fireworks = defineProvider({
  ...openaiCompatible,
  name: 'fireworks',
  baseUrl: 'https://api.fireworks.ai/inference/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.FIREWORKS_API_KEY,
      },
    },
  },
})
