/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { Chat } from './chat'
import type { Embeddings } from './embeddings'
import type { Image } from './image'
import type { Models } from './models'
import type { Speech } from './speech'
import type { Transcript } from './transcript'
import type { Provider, ProviderByName, ProviderName, ProviderOptions, ProviderOptionsByName } from './utils'
import { Emitter } from '@unshared/functions/createEmitter'
import { generateText } from './chat'
import { generateEmbeddings } from './embeddings'
import { generateImage } from './image'
import { searchModels } from './models'
import * as PROVIDERS from './providers'
import { createSpeech } from './speech'
import { createTranscript } from './transcript'

export type ProviderEventMap = {
  'request': [requestId: string, { url: URL; init: RequestInit }]
  'response': [requestId: string, Response]
  'error': [requestId: string, Error]

  // Models
  'modelsRequest': [requestId: string, Models.Context]
  'modelsResponse': [requestId: string, Models.Context]
  'modelsResult': [requestId: string, Models.Result]
  'modelsError': [requestId: string, Error]

  // Chat Text Generation
  'chatRequest': [requestId: string, Chat.Context]
  'chatResponse': [requestId: string, Chat.Context]
  'chatEvent': [requestId: string, Chat.Event]
  'chatError': [requestId: string, Error]

  // Image Generation
  'imageRequest': [requestId: string, Image.Context]
  'imageResponse': [requestId: string, Image.Context]
  'imageResult': [requestId: string, Image.Result[]]
  'imageError': [requestId: string, Error]

  // Text to Speech
  'speechRequest': [requestId: string, Speech.Context]
  'speechResponse': [requestId: string, Speech.Context]
  'speechResult': [requestId: string, Speech.Result[]]
  'speechError': [requestId: string, Error]

  // Speech to Text
  'transcriptRequest': [requestId: string, Transcript.Context]
  'transcriptResponse': [requestId: string, Transcript.Context]
  'transcriptResult': [requestId: string, Transcript.Result[]]
  'transcriptError': [requestId: string, Error]

  // Embeddings
  'embeddingsRequest': [requestId: string, Embeddings.Context]
  'embeddingsResponse': [requestId: string, Embeddings.Context]
  'embeddingsResult': [requestId: string, Embeddings.Result]
  'embeddingsError': [requestId: string, Error]
}

/**
 * The `Client` class represents a client that can interact with
 * an AI provider's API to perform text generation and other tasks.
 * It encapsulates the provider's options and provides methods to
 * generate text and search for models.
 */
export class Client<T extends Provider = Provider> extends Emitter<ProviderEventMap> {
  constructor(
    public readonly provider: T,
    public readonly options?: Record<string, unknown>,
  ) { super() }

  /**
   * Searches for models based on the provided request.
   *
   * @param request The request object containing the search parameters.
   * @returns A promise that resolves to a list of models matching the search criteria.
   */
  searchModels(request?: Models.Request<T>): Promise<Models.Result> {
    return searchModels<T>(this, request)
  }

  /**
   * Generates an image based on the provided request using the specified model.
   *
   * @param request The request object containing the model and input data.
   * @returns A promise that resolves to an array of generated images.
   */
  generateImage(request: Image.Request<T>): Promise<Image.Result[]> {
    return generateImage<T>(this, request)
  }

  /**
   * Generates text based on the provided request using the specified model.
   *
   * @param request The request object containing the model and input data.
   * @returns A promise that resolves to a readable stream of generated text.
   */
  generateText(request: Chat.Request<T>): Promise<ReadableStream<string>> {
    return generateText<T>(this, request)
  }

  /**
   * Generates text based on the provided request using the specified model.
   *
   * @param request The request object containing the model and input data.
   * @returns A promise that resolves to a readable stream of generated text.
   */
  createSpeech(request: Speech.Request<T>): Promise<Speech.Result[]> {
    return createSpeech<T>(this, request)
  }

  /**
   * Generates speech from text using the specified model.
   *
   * @param request The request object containing the model and input data.
   * @returns A promise that resolves to the speech result.
   */
  generateSpeechToText(request: Transcript.Request<T>): Promise<Transcript.Result[]> {
    return createTranscript<T>(this, request)
  }

  /**
   * Generates embeddings for the provided input using the specified model.
   *
   * @param request The request object containing the model and input data.
   * @returns A promise that resolves to the embeddings result.
   */
  generateEmbeddings(request: Embeddings.Request<T>): Promise<Embeddings.Result> {
    return generateEmbeddings<T>(this, request)
  }
}

/**
 * Instantiate a new `Client` based on the given `Provider` and options.
 *
 * @param provider The provider instance, which can be any object that implements the `Provider` interface.
 * @param options The options object containing the provider's configuration.
 * @returns A new instance of the `Provider` class.
 */
export function createClient<T extends Provider>(provider: T, options?: ProviderOptions<T>): Client<T>

/**
 * Instantiate a new `Client` based on the given provider name and options.
 *
 * @param name The name of the provider, which should be one of the keys in the `PROVIDERS` map.
 * @param options Optional additional options to configure the provider.
 * @returns A new instance of the `Provider` class.
 */
export function createClient<T extends ProviderName>(name: T, options?: ProviderOptionsByName<T>): Client<ProviderByName<T>>

/**
 * Instantiate a new `Client` based on the given provider or provider name.
 *
 * @param providerOrName The provider instance or the name of the provider.
 * @param options Optional additional options to configure the provider.
 * @returns A new instance of the `Client` class.
 */
export function createClient(providerOrName: Provider | ProviderName, options?: Record<string, unknown>): Client
export function createClient(providerOrName: Provider | ProviderName, options?: Record<string, unknown>): Client {
  if (typeof providerOrName !== 'string') return new Client(providerOrName, options)
  if (providerOrName in PROVIDERS) return new Client(PROVIDERS[providerOrName], options)
  throw new Error(`Unknown provider: ${providerOrName}`) // Ensure the provider exists in the PROVIDERS map
}
