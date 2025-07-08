import { defineProviderOptions } from '../utils'
import { openai } from './openai'

export const openRouter = defineProviderOptions({
  ...openai,
  name: 'open-router',
  baseUrl: 'https://openrouter.ai/api/v1',
  parameters: [
    {
      name: 'apiKey',
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: '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',
      },
    },
    {
      name: 'siteUrl',
      path: 'HTTP-Referer',
      location: 'header',
      schema: {
        type: 'string',
        required: false,
        default: 'https://nwrx.io',
      },
    },
    {
      name: 'siteTitle',
      path: 'X-Title',
      location: 'header',
      schema: {
        type: 'string',
        required: false,
        default: 'Nanoworks',
      },
    },
  ],
})
