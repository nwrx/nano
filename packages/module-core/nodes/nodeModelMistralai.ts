import type { OpenaiChatRequest } from '../utils'
import type { InferenceData } from './nodeInference'
import { defineLanguageModel, openaiGetBody, openaiGetModels } from '../utils'

export const nodeModelMistralai = defineLanguageModel({
  name: 'MistralAI',
  kind: 'core/mistralai',
  icon: 'https://api.iconify.design/logos:mistral-ai-icon.svg',
  description: 'The **MistralAI API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the MistralAI API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',

  defaultUrl: 'https://api.mistral.ai',
  defaultModel: 'open-mistral-7b',
  pathModels: '/v1/models',
  pathCompletions: '/v1/chat/completions',
  allowCustomToken: true,
  allowCustomModel: true,

  getBody: (data: InferenceData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { max_completion_tokens, seed, ...body } = openaiGetBody(data)
    return { max_tokens: max_completion_tokens, ...body } as OpenaiChatRequest
  },
  getModels: openaiGetModels,
})
