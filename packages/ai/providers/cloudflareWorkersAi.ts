import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const cloudflareWorkersAi = defineProvider({
  ...openaiCompatible,
  name: 'cloudflare-workers-ai',
  baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.CLOUDFLARE_API_TOKEN,
      },
    },
    accountId: {
      path: 'accountId',
      location: 'path',
      schema: {
        type: 'string',
        required: true,
        default: process.env.CLOUDFLARE_ACCOUNT_ID,
      },
    },
  },
})
