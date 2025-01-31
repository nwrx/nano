import { defineLanguageModel } from '../../inference'
import { openaiOnRequest } from './openaiOnRequest'
import { openaiOnResponse } from './openaiOnResponse'
import { openaiSearchModels } from './openaiSearchModels'

export const openai = defineLanguageModel({
  title: 'OpenAI',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **OpenAI API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the OpenAI API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
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
