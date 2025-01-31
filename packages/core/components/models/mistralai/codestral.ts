import { defineLanguageModel } from '../../inference'
import { openaiOnRequest, openaiOnResponse, openaiSearchModels } from '../openai'

export const codestral = defineLanguageModel({
  title: 'Codestral',
  icon: 'https://api.iconify.design/logos:mistral-ai-icon.svg',
  description: 'The **Mistral Codestral API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the CodeStral API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
  defaultBaseUrl: 'https://codestral.mistral.com/v1',
  defaultModelId: 'open-codestral-7b',
  pathModels: '/models',
  pathCompletions: '/chat/completions',
  allowCustomToken: true,
  allowCustomModelId: true,
  onRequest: (context) => {
    openaiOnRequest(context)
    const { body } = context.init
    body.max_tokens = body.max_completion_tokens
    delete body.max_completion_tokens
  },
  onResponse: openaiOnResponse,
  searchModels: openaiSearchModels,
})
