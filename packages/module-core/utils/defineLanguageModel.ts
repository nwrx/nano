import type { SocketListOption, Type } from '@nwrx/core'
import type { ObjectLike } from '@unshared/types'
import type { LanguageModel } from '../types'
import { defineNode } from '@nwrx/core'
import { categoryLanguageModel } from '../categories'
import { languageModel, string } from '../types'
import { openaiGetBody } from './openaiGetBody'
import { openaiGetModels } from './openaiGetModels'
import { openaiOnData } from './openaiOnData'
import { openaiOnError } from './openaiOnError'

export interface LanguageModelData {
  baseUrl: string
  model: string
  token: string
}

export interface LanguageModelGetModelsOptions {
  path: string
  token?: string
  baseUrl?: string
  abortSignal: AbortSignal
  query?: string
}

export interface LanguageModelOptions<T = ObjectLike, U = ObjectLike>
  extends Partial<Pick<LanguageModel<T, U>, 'getBody' | 'onData' | 'onError' >> {
  kind: string
  name?: string
  icon?: string
  description?: string
  defaultUrl?: string
  defaultModel?: string
  pathModels?: string
  pathCompletions?: string
  getModels?: (options: LanguageModelGetModelsOptions) => Promise<Array<SocketListOption<string>>>
}

/**
 * Wrapper around the {@linkcode defineNode} function that creates a standardized
 * language model node for a specific API. The function takes-in several options
 * that streamline the process of adapting the node to different inference providers.
 *
 * @param options The options for creating the language model node.
 * @returns The language model node.
 */
export function defineLanguageModel<T, U>(options: LanguageModelOptions<T, U>) {
  const {
    kind,
    name,
    icon,
    description,
    defaultUrl,
    defaultModel,
    pathModels = '/models',
    pathCompletions = '/chat/completions',
    onData = openaiOnData,
    onError = openaiOnError,
    getBody = openaiGetBody,
    getModels = openaiGetModels,
  } = options

  return defineNode({
    kind,
    name,
    icon,
    description,
    category: categoryLanguageModel,

    inputSchema: {
      baseUrl: {
        name: 'URL',
        type: string,
        control: 'variable',
        description: 'The base URL for the inference provider.',
        defaultValue: defaultUrl,
        isInternal: Boolean(defaultUrl),
        isOptional: Boolean(defaultUrl),
      },
      token: {
        name: 'API Key',
        type: string,
        control: 'variable',
        description: 'The API Key used to authenticate with the inference provider.',
      },
      model: {
        type: string,
        control: 'select',
        name: 'Model',
        defaultValue: defaultModel,
        description: 'The name of the model to use for generating completions.',
        options: ({ input, abortSignal }, query) => getModels({
          path: pathModels,
          token: input.token as string,
          baseUrl: input.baseUrl as string,
          abortSignal,
          query,
        }),
      },
    },

    outputSchema: {
      model: {
        name: 'Model',
        type: languageModel as Type<LanguageModel<T, U>>,
        description: 'The model information to use for generating completions.',
      },
    },

    process: ({ input }) => ({
      model: {
        url: new URL(pathCompletions, input.baseUrl).toString(),
        model: input.model,
        token: input.token,
        getBody,
        onError,
        onData,
      } as LanguageModel<T, U>,
    }),
  })
}
