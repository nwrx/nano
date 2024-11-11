import type { OpenaiChatRequest } from '../utils'
import type { InferenceData } from './nodeInference'
import { defineLanguageModel, openaiGetBody, openaiGetModels } from '../utils'

export const nodeModelGroq = defineLanguageModel({
  name: 'Groq',
  kind: 'core/groq',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **Groq API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the Groq API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',

  // --- API-specific properties.
  defaultUrl: 'https://api.groq.com',
  defaultModel: 'llama3-8b-8192',
  pathModels: '/openai/v1/models',
  pathCompletions: '/openai/v1/chat/completions',

  // --- Compute the body of the request.
  getBody: (data: InferenceData) => {
    const { max_completion_tokens, ...body } = openaiGetBody(data)
    return { max_tokens: max_completion_tokens, ...body } as OpenaiChatRequest
  },

  // --- Fetch the models available for the API.
  getModels: openaiGetModels,
})
