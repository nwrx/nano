import type { LanguageModelSearchModelsOptions } from '../../inference'

export async function ollamaSearchModels(options: LanguageModelSearchModelsOptions): Promise<SchemaOption[]> {
  const url = new URL(path, baseUrl)
  const response = await fetch(url.href, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const models = await response.json() as { models: OllamaModel[] }
  return models.models
    .filter((model) => {
      if (!query) return true
      return model.name.toLowerCase().includes(query.toLowerCase())
    })
    .map(model => ({
      value: model.name,
      label: model.name,
      description: `Size: ${model.details.parameter_size} | Quantization: ${model.details.quantization_level}`,
      icon: 'https://api.iconify.design/simple-icons:ollama.svg',
    }))
}
