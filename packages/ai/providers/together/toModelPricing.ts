import type { Models } from '../../models'
import type { Together } from './types'

export function toModelPricing(model: Together.Model): Models.ModelPricing[] {
  const pricing: Models.ModelPricing[] = []

  if (model.type === 'chat') {
    pricing.push(
      {
        type: 'inputToken',
        currency: 'USD',
        perCount: 1_000_000,
        cost: model.pricing.input,
      },
      {
        type: 'outputToken',
        currency: 'USD',
        perCount: 1_000_000,
        cost: model.pricing.output,
      },
    )
  }

  return pricing
}
