import type { Models } from '../../models'
import type { Together } from './types'
import { toModelFeature } from './toModelFeature'
import { toModelPricing } from './toModelPricing'

export async function onResponseModels(context: Models.Context): Promise<Models.Model[]> {
  const { response } = context
  if (!response) throw new Error('Response is not defined in context')
  if (!response.ok) throw new Error(`Failed to fetch models: ${response.statusText}`)

  const data = await response.json() as Together.Model[]
  return data.map<Models.Model>(model => ({
    name: model.id,
    link: model.link,
    title: model.display_name,
    vendor: model.organization,
    licence: model.license,
    createdAt: new Date(model.created * 1000).toISOString(),
    features: toModelFeature(model.type),
    pricing: toModelPricing(model),
    config: {
      contextLength: model.context_length,
      stop: model.config?.stop,
      bosToken: model.config?.bos_token,
      eosToken: model.config?.eos_token,
      chatTemplate: model.config?.chat_template,
    },
    raw: model,
  }))
}
