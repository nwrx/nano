import type { Provider, ProviderFeatureName, ProviderFeatureOptions } from '../utils'

/**
 * The SearchModels namespace contains types and interfaces for searching and listing
 * available models from AI providers.
 */
export namespace Models {
  export interface Request<T extends Provider = Provider> {
    id?: string
    signal?: AbortSignal
    options?: ProviderFeatureOptions<T, 'models'>
  }

  export interface Context<T extends Provider = Provider> {
    id: string
    provider: T
    request: Request<T>
    url: URL
    init: RequestInit
    response?: Response
  }

  export interface ModelConfig {
    contextLength?: number
    chatTemplate?: string
    stop?: string[]
    bosToken?: string
    eosToken?: string
  }

  export interface ModelPricing {
    type: 'inputToken' | 'outputToken'
    currency?: 'EUR' | 'USD'
    perCount?: number
    cost?: number
  }

  export interface Model {
    name: string
    link?: string
    title?: string
    vendor?: string
    licence?: string
    createdAt?: string
    description?: string
    features?: ProviderFeatureName[]
    config?: ModelConfig
    pricing?: ModelPricing[]
    raw?: object
  }

  export interface Result {
    models: Model[]
  }
}
