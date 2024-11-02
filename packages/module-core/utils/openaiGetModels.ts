import type { LanguageModelNodeData } from './defineNodeLanguageModel'
import type { OpenaiModelResponse } from './OpenaiModelResponse'

const ICONS = [
  { match: /openai|gpt/i, icon: 'https://api.iconify.design/simple-icons:openai.svg' },
  { match: /hugging/i, icon: 'https://api.iconify.design/logos:hugging-face-icon.svg' },
  { match: /groq/i, icon: 'https://api.iconify.design/simple-icons:openai.svg' },
  { match: /google|gemini/i, icon: 'https://api.iconify.design/logos:google-icon.svg' },
  { match: /microsoft|phi/i, icon: 'https://api.iconify.design/logos:microsoft-icon.svg' },
  { match: /mi[sx]tral/i, icon: 'https://api.iconify.design/logos:mistral-ai-icon.svg' },
  { match: /meta|llama/i, icon: 'https://api.iconify.design/logos:meta-icon.svg' },
  { match: /other/i, icon: 'https://api.iconify.design/carbon:flow-stream.svg' },
]

function getModelIcon(model: string) {
  return ICONS.find(x => x.match.test(model))?.icon
}

export function openaiGetModels(path: string) {
  return async(data: LanguageModelNodeData, signal: AbortSignal) => {
    if (!data.token) return []
    const url = new URL(path, data.baseUrl).toString()
    const response = await fetch(url, { signal, headers: { Authorization: `Bearer ${data.token}` } })
    const models = await response.json() as OpenaiModelResponse
    return models.data.filter(x => x.object === 'model').map(x => ({
      value: x.id,
      label: x.id,
      description: x.owned_by,
      icon: getModelIcon(x.owned_by),
    }))
  }
}
