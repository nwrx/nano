import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const openRouter = defineProvider({
  ...openaiCompatible,
  name: 'open-router',
  baseUrl: 'https://openrouter.ai/api/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.OPENROUTER_API_KEY,
      },
    },
    siteUrl: {
      path: 'HTTP-Referer',
      location: 'header',
      schema: {
        type: 'string',
        required: false,
        default: 'https://nwrx.io',
      },
    },
    siteTitle: {
      path: 'X-Title',
      location: 'header',
      schema: {
        type: 'string',
        required: false,
        default: 'Nanoworks',
      },
    },
  },
})
