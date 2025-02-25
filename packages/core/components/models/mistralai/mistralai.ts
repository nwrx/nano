import { defineLanguageModel } from '../../inference'
import { openaiOnRequest, openaiOnResponse, openaiSearchModels } from '../openai'

export const mistralai = defineLanguageModel({
  defaultBaseUrl: 'https://api.mistral.ai/v1',
  defaultModelId: 'open-mistral-7b',
  pathModels: '/models',
  pathCompletions: '/chat/completions',
  allowCustomToken: true,
  allowCustomModelId: true,
  onRequest: async(context, token) => {
    await openaiOnRequest(context, token)
    const { body } = context
    body.max_tokens = body.max_completion_tokens
    body.random_seed = body.seed
    delete body.max_completion_tokens
    delete body.parallel_tool_calls
  },
  onResponse: openaiOnResponse,
  searchModels: openaiSearchModels,
})
