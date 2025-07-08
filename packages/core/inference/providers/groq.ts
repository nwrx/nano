import { defineProviderOptions } from '../utils'
import { openai } from './openai'

export const groq = defineProviderOptions({
  ...openai,
  name: 'groq',
  baseUrl: 'https://api.groq.com/openai/v1',
  parameters: [
    {
      name: 'apiKey',
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.GROQ_API_KEY,
      },
    },
  ],
})
