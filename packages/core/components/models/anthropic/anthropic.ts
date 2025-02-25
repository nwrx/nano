import { defineLanguageModel } from '../../inference'
import { anthropicOnRequest } from './anthropicOnRequest'
import { anthropicOnResponse } from './anthropicOnResponse'
import { anthropicSearchModels } from './anthropicSearchModels'

export const anthropic = defineLanguageModel({
  defaultBaseUrl: 'https://api.anthropic.com/v1',
  defaultModelId: 'claude-3-5-sonnet-20241022',
  pathModels: '/models',
  pathCompletions: '/messages',
  allowCustomBaseUrl: true,
  allowCustomModelId: true,
  allowCustomToken: true,
  onRequest: anthropicOnRequest,
  onResponse: anthropicOnResponse,
  searchModels: anthropicSearchModels,
})
