import type { MaybePromise } from '@unshared/types'
import type { Schema } from 'jsonschema'
import type { TextGeneration } from '../textGeneration'

export interface ProviderParameter {
  name: string
  path: string
  schema: Schema
  location: 'body' | 'header' | 'path' | 'query'
}

export interface ProviderOptions {
  name: string
  baseUrl: string
  fetch?: typeof globalThis.fetch
  parameters?: ProviderParameter[]
  features?: {
    searchModels?: {
      path: string
      parameters?: ProviderParameter[]
    }
    textGeneration?: {
      path: string
      parameters?: ProviderParameter[]
      onRequest: (context: TextGeneration.Context) => MaybePromise<void>
      onResponse: (context: TextGeneration.Context) => MaybePromise<void>
    }
  }
}

export function defineProviderOptions(adapter: ProviderOptions): ProviderOptions {
  return adapter
}

export function extendProvider(provider: ProviderOptions, options: Partial<ProviderOptions>): ProviderOptions {
  return {
    ...provider,
    ...options,
    parameters: [
      ...(provider.parameters ?? []),
      ...(options.parameters ?? []),
    ],
    features: {
      ...provider.features,
      ...options.features,
      searchModels: {
        ...provider.features?.searchModels,
        ...options.features?.searchModels,
      },
      textGeneration: {
        ...provider.features?.textGeneration,
        ...options.features?.textGeneration,
      },
    },
  }
}
