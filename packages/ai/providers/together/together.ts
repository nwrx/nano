import { defineProvider } from '../../utils'
import { openai } from '../openai'
import { onResponseModels } from './onResponseModels'

export const together = defineProvider({
  ...openai,
  name: 'together',
  baseUrl: 'https://api.together.xyz/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.TOGETHER_AI_API_KEY,
      },
    },
  },
  models: {
    path: '/models',
    onResponse: onResponseModels,
  },
} as const)
