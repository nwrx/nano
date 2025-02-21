import { defineLanguageModel } from '../../inference'

export const ollama = defineLanguageModel({
  icon: 'https://api.iconify.design/simple-icons:ollama.svg',
  description: 'The **Ollama API** node is designed to retrieve a **Language Model Instance** that can be used to generate completions using the Ollama API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
  defaultBaseUrl: 'http://localhost:11434',
  defaultModelId: 'default-model',
  pathModels: '/api/tags',
  pathCompletions: '/api/chat',
  allowCustomBaseUrl: true,
  allowCustomModelId: true,
})
