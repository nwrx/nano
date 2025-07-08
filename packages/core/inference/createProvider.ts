/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { TextGeneration } from './textGeneration'
import type { ProviderOptions } from './utils'
import { Emitter } from '@unshared/functions/createEmitter'
import * as PROVIDERS from './providers'
import { generateText, searchModels } from './textGeneration'

export type ProviderEventMap = {
  'request': [{ url: URL; init: RequestInit }]
  'response': [Response]
  'textGenerationStart': [TextGeneration.Request]
  'textGenerationEvent': [TextGeneration.Event]
  'textGenerationEnd': [TextGeneration.Context]
}

/** A union of all adapter names. */
export type ProviderName = keyof typeof PROVIDERS

/**
 * The `Provider` class represents a client that can interact with
 * an AI provider's API to perform text generation and other tasks.
 * It encapsulates the provider's options and provides methods to
 * generate text and search for models.
 */
export class Provider extends Emitter<ProviderEventMap> {
  constructor(
    public readonly provider: ProviderOptions,
    public readonly options?: Record<string, unknown>,
  ) { super() }

  generateText = generateText.bind(this)
  searchModels = searchModels.bind(this)
}

/**
 * Instantiate a new `Provider` object based on the given provider name or options.
 *
 * @param provider The name of the provider or a custom provider options object.
 * @param options Optional additional options to configure the provider.
 * @returns A new instance of the `Provider` class.
 */
export function createProvider(
  provider: ProviderName | ProviderOptions,
  options?: Record<string, unknown>,
): Provider {
  if (typeof provider !== 'string') return new Provider(provider, options)
  if (provider in PROVIDERS) return new Provider(PROVIDERS[provider], options)
  throw new Error(`Unknown provider: ${provider}`) // Ensure the provider exists in the PROVIDERS map
}
