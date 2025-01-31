import { defineLanguageModel } from '../../inference'
import { anthropicOnRequest } from './anthropicOnRequest'
import { anthropicOnResponse } from './anthropicOnResponse'
import { anthropicSearchModels } from './anthropicSearchModels'

export const anthropic = defineLanguageModel({
  title: 'Anthropic',
  icon: 'https://api.iconify.design/simple-icons:anthropic.svg',
  description: 'The **Anthropic API** node is designed to retrieve a **Language Model Instance** that can be used to generate completions using the Anthropic API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
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
