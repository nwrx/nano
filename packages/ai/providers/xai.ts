import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const xai = defineProvider({
  ...openaiCompatible,
  name: 'xai',
  baseUrl: 'https://api.x.ai/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.XAI_API_KEY,
      },
    },
  },
})
