/* eslint-disable sonarjs/todo-tag */
import type { MaybePromise } from '@unshared/types'
import type { Schema } from 'jsonschema'
import type { Chat } from '../chat'
import type { Embeddings } from '../embeddings'
import type { Image } from '../image'
import type { Models } from '../models'
import type * as PROVIDERS from '../providers'
import type { Speech } from '../speech'
import type { Transcript } from '../transcript'
import type { SchemaValue } from './schema'

/** A union of all adapter names. */
export type ProviderName = keyof typeof PROVIDERS

/** Represents a parameter definition for a provider and/or feature. */
export interface ProviderParameter<S extends Schema = Schema> {
  path?: string
  schema: S
  location: 'body' | 'header' | 'path' | 'query'
}

/** The parameters definitions for a provider, indexed by name. */
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ProviderParameters { [x: string]: ProviderParameter }

/**
 * Represents a feature of a provider, which includes a path, optional parameters,
 * and functions to handle requests and responses.
 *
 * @template Context The context type for the feature, which can be used to pass additional data.
 * @template Result The result type for the feature, which can be used to specify the expected output.
 */
export interface ProviderFeature<
  Context extends object = object,
  Result = void,
> {
  path: string
  parameters?: ProviderParameters
  onRequest?: (context: Context) => MaybePromise<void>
  onResponse: (context: Context) => MaybePromise<Result>
}

export interface Provider {
  name: string
  baseUrl: string
  parameters?: ProviderParameters
  models?: ProviderFeature<Models.Context, Models.Result>
  chat?: ProviderFeature<Chat.Context>
  embeddings?: ProviderFeature<Embeddings.Context, Embeddings.Result>
  transcript?: ProviderFeature<Transcript.Context, Transcript.Result[]>
  speech?: ProviderFeature<Speech.Context, Speech.Result[]>
  image?: ProviderFeature<Image.Context, Image.Result[]>
}

export type ProviderFeatureName =
  | 'chat'
  | 'embeddings'
  | 'image'
  | 'models'
  | 'speech'
  | 'transcript'

export type ParametersValues<T extends ProviderParameters> =
 {
   [K in keyof T]?:
   T[K] extends ProviderParameter<infer S>
     ? SchemaValue<S>
     : never
 }

export type ProviderOptions<T extends Provider> =
  T extends { parameters: infer P extends ProviderParameters }
    ? ParametersValues<P>
    : never

export type ProviderFeatureOptions<T extends Provider, F extends ProviderFeatureName> =
  T extends Partial<Record<F, { parameters: infer U extends ProviderParameters }>>
    ? ParametersValues<U>
    : never

/** Infer the provider options based on the provider name. */
export type ProviderByName<T extends ProviderName> =
  T extends keyof typeof PROVIDERS
    ? (typeof PROVIDERS)[T]
    : never

/** Infer the options based on a provider name. */
export type ProviderOptionsByName<T extends ProviderName> =
  ProviderOptions<ProviderByName<T>>
