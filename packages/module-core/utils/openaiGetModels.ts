import type { LanguageModelGetModelsOptions } from './defineLanguageModel'
import type { OpenaiModelResponse } from './openai'
import { openaiOnError } from './openaiOnError'

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

export async function openaiGetModels({ path, baseUrl, token, query }: LanguageModelGetModelsOptions) {
  if (!token) return []

  // --- Fetch the models available for the API.
  const url = new URL(path, baseUrl).toString()
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw await openaiOnError(response)

  const models = await response.json() as OpenaiModelResponse
  const queryLower = query?.toLowerCase()
  return models.data
    .filter((x) => {
      if (x.object !== 'model') return false
      if (!queryLower) return true
      return x.id.toLowerCase().includes(queryLower)
        || x.owned_by.toLowerCase().includes(queryLower)
    })
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(x => ({
      value: x.id,
      label: x.id,
      description: x.owned_by,
      icon: getModelIcon(x.owned_by),
    }))
}
