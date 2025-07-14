import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const novita = defineProvider({
  ...openaiCompatible,
  name: 'novita',
  baseUrl: 'https://api.novita.ai/v3/openai',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.NOVITA_API_KEY,
      },
    },
  },
})
