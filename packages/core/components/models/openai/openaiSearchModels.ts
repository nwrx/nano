import type { SchemaOption } from '../../../utils'
import type { LanguageModelSearchModelsOptions } from '../../inference'
import type { OpenAI } from './types'
import { joinUrl } from '../../inference/utils/joinUrl'
import { openaiOnResponseError } from './openaiOnResponseError'

const ICONS = [
  [/openai|gpt/i, 'https://api.iconify.design/simple-icons:openai.svg'],
  [/hugging/i, 'https://api.iconify.design/logos:hugging-face-icon.svg'],
  [/groq/i, 'https://api.iconify.design/simple-icons:openai.svg'],
  [/google|gemini/i, 'https://api.iconify.design/logos:google-icon.svg'],
  [/microsoft|phi/i, 'https://api.iconify.design/logos:microsoft-icon.svg'],
  [/mi[sx]tral/i, 'https://api.iconify.design/logos:mistral-ai-icon.svg'],
  [/meta|llama/i, 'https://api.iconify.design/logos:meta-icon.svg'],
  [/other/i, 'https://api.iconify.design/carbon:flow-stream.svg'],
] as const

export function getModelIcon(model: string) {
  for (const [match, icon] of ICONS) if (match.test(model)) return icon
  return 'https://api.iconify.design/carbon:flow-stream.svg'
}

export async function openaiSearchModels(options: LanguageModelSearchModelsOptions): Promise<SchemaOption[]> {
  const { baseUrl, pathModels, query, token } = options
  if (!token) return []

  // --- Fetch the models available for the API.
  const url = joinUrl(baseUrl, pathModels)
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) throw await openaiOnResponseError(response)

  const models = await response.json() as OpenAI.ModelResponse
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
