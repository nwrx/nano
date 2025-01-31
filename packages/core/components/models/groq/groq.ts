import { defineLanguageModel } from '../../inference'
import { openaiOnRequest, openaiOnResponse, openaiSearchModels } from '../openai'

export const groq = defineLanguageModel({
  title: 'Groq',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **Groq API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the Groq API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
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
