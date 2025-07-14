import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const deepinfra = defineProvider({
  ...openaiCompatible,
  name: 'deepinfra',
  baseUrl: 'https://api.deepinfra.com/v1/openai',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.DEEPINFRA_API_KEY,
      },
    },
  },
})
