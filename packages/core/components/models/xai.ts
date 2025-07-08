import { defineLanguageModel } from '../../inference'
import { openaiOnRequest, openaiOnResponse, openaiSearchModels } from './openai'

export const xai = defineLanguageModel({
  defaultBaseUrl: 'https://api.x.ai/v1',
  defaultModelId: 'grok-beta',
  pathModels: '/models',
  pathCompletions: '/chat/completions',
  allowCustomBaseUrl: true,
  allowCustomModelId: true,
  allowCustomToken: true,
  onRequest: openaiOnRequest,
  onResponse: openaiOnResponse,
  searchModels: openaiSearchModels,
})
