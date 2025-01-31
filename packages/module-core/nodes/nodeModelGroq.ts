import { defineNodeLanguageModel, openaiGetBody } from '../utils'

export const nodeModelGroq = defineNodeLanguageModel({
  name: 'Groq',
  kind: 'core/groq',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **Groq API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the Groq API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
  defaultUrl: 'https://api.groq.com',
  defaultModel: 'gpt-3.5-turbo',
  pathModels: '/openai/v1/models',
  pathCompletions: '/openai/v1/chat/completions',
  getBody: (data) => {
    const { max_completion_tokens, ...body } = openaiGetBody(data)
    return { max_tokens: max_completion_tokens, ...body }
  },
})
