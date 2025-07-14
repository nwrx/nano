import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const hyperbolic = defineProvider({
  ...openaiCompatible,
  name: 'hyperbolic',
  baseUrl: 'https://api.hyperbolic.xyz/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.HYPERBOLIC_API_KEY,
      },
    },
  },
})
