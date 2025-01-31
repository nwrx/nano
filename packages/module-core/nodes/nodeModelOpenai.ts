import type { OpenaiChatRequest, OpenaiChatResponse } from '../utils'
import { defineLanguageModel, openaiGetBody, openaiGetModels } from '../utils'

export const nodeModelOpenai = defineLanguageModel<OpenaiChatRequest, OpenaiChatResponse>({
  name: 'OpenAI',
  kind: 'core/openai',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **OpenAI API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the OpenAI API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',

  defaultUrl: 'https://api.openai.com',
  defaultModel: 'gpt-3.5-turbo',
  pathModels: '/v1/models',
  pathCompletions: '/v1/chat/completions',
  allowCustomToken: true,
  allowCustomModel: true,

  getBody: openaiGetBody,
  getModels: openaiGetModels,
})
