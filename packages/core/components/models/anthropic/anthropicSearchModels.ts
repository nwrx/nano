import type { SchemaOption } from '../../../utils'
import type { LanguageModelSearchModelsOptions } from '../../inference'
import type { Anthropic } from './types'
import { joinUrl } from '../../inference/utils/joinUrl'
import { openaiOnResponseError } from '../openai/openaiOnResponseError'

export async function anthropicSearchModels(options: LanguageModelSearchModelsOptions): Promise<SchemaOption[]> {
  const { baseUrl, pathModels, query, token } = options
  if (!token) return []

  // --- Fetch the models available for the API.
  const url = joinUrl(baseUrl, pathModels)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': token,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw await openaiOnResponseError(response)

  const models = await response.json() as Anthropic.ModelResponse
  const queryLower = query?.toLowerCase()
  return models.data
    .filter((x) => {
      if (x.type !== 'model') return false
      if (!queryLower) return true
      return x.id.toLowerCase().includes(queryLower)
        || x.display_name.toLowerCase().includes(queryLower)
    })
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(x => ({
      value: x.id,
      label: x.id,
      description: x.display_name,
      icon: 'https://api.iconify.design/simple-icons:anthropic.svg',
    }))
}
