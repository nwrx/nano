import type { OpenaiChatRequest, OpenaiChatResponse } from '../utils'
import { defineLanguageModel, openaiGetBody, openaiGetModels } from '../utils'

export const nodeModelXai = defineLanguageModel({
  name: 'xAI',
  kind: 'core/xai',
  icon: 'https://api.iconify.design/token:xai.svg',
  description: 'The **xAI API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the xAI API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',

  defaultUrl: 'https://api.x.ai/v1',
  defaultModel: 'grok-beta',
  pathModels: '/models',
  pathCompletions: '/chat/completions',
  allowCustomToken: true,
  allowCustomModel: true,

  getBody: openaiGetBody,
  getModels: openaiGetModels,
})
