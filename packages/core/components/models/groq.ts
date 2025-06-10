import { defineLanguageModel } from '../inference'
import { openaiOnRequest, openaiOnResponse, openaiSearchModels } from './openai'

export const groq = defineLanguageModel({
  defaultModelId: 'llama3-8b-8192',
  defaultBaseUrl: 'https://api.groq.com/openai/v1',
  pathModels: '/models',
  pathCompletions: '/chat/completions',
  allowCustomToken: true,
  allowCustomModelId: true,
  allowCustomBaseUrl: true,
  onRequest: async(context, token) => {
    await openaiOnRequest(context, token)
    const { body } = context
    body.max_tokens = body.max_completion_tokens
    delete body.max_completion_tokens
  },
  onResponse: openaiOnResponse,
  searchModels: openaiSearchModels,
})
