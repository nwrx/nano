import { defineLanguageModel } from '../../../inference'

export const ollama = defineLanguageModel({
  defaultBaseUrl: 'http://localhost:11434',
  defaultModelId: 'default-model',
  pathModels: '/api/tags',
  pathCompletions: '/api/chat',
  allowCustomBaseUrl: true,
  allowCustomModelId: true,
})
