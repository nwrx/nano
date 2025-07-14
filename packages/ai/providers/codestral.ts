import { defineProvider } from '../utils'
import { mistral } from './mistral'

export const codestral = defineProvider({
  ...mistral,
  name: 'codestral',
  baseUrl: 'https://codestral.mistral.ai/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.MISTRAL_API_KEY,
      },
    },
  },
})
