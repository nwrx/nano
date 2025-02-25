import { defineLanguageModel } from '../../inference'
import { openaiOnRequest } from './openaiOnRequest'
import { openaiOnResponse } from './openaiOnResponse'
import { openaiSearchModels } from './openaiSearchModels'

export const openai = defineLanguageModel({
  defaultBaseUrl: 'https://api.openai.com/v1',
  defaultModelId: 'gpt-3.5-turbo',
  pathModels: '/models',
  pathCompletions: '/chat/completions',
  allowCustomBaseUrl: true,
  allowCustomModelId: true,
  allowCustomToken: true,
  onRequest: openaiOnRequest,
  onResponse: openaiOnResponse,
  searchModels: openaiSearchModels,
})
