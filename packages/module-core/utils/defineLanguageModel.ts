import type { SocketListOption, Type } from '@nwrx/nano'
import type { ObjectLike } from '@unshared/types'
import type { LanguageModel } from '../types'
import { defineComponent } from '@nwrx/nano'
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
  query?: string
}

export interface LanguageModelOptions<T = ObjectLike, U = ObjectLike>
  extends Partial<Pick<LanguageModel<T, U>, 'getBody' | 'onData' | 'onError' >> {
  kind: string
  name?: string
  icon?: string
  description?: string
  allowCustomUrl?: boolean
  allowCustomModel?: boolean
  allowCustomToken?: boolean
  defaultUrl?: string
  defaultModel?: string
  pathModels?: string
  pathCompletions?: string
  getModels?: (options: LanguageModelGetModelsOptions) => Promise<Array<SocketListOption<string>>>
}

/**
 * Wrapper around the {@linkcode defineComponent} function that creates a standardized
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
    allowCustomUrl,
    allowCustomModel,
    allowCustomToken,
    pathModels = '/models',
    pathCompletions = '/chat/completions',
    onData = openaiOnData,
    onError = openaiOnError,
    getBody = openaiGetBody,
    getModels = openaiGetModels,
  } = options

  return defineComponent({
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
        isInternal: !allowCustomUrl && Boolean(defaultUrl),
        isOptional: Boolean(defaultUrl),
      },
      token: {
        name: 'API Key',
        type: string,
        control: 'variable',
        description: 'The API Key used to authenticate with the inference provider.',
        isInternal: !allowCustomToken,
        isOptional: true,
      },
      model: {
        type: string,
        control: 'select',
        name: 'Model',
        defaultValue: defaultModel,
        description: 'The name of the model to use for generating completions.',
        isInternal: !allowCustomModel && Boolean(defaultModel),
        isOptional: Boolean(defaultModel),
        options: ({ token, baseUrl }, query) => getModels({
          path: pathModels,
          token: token as string,
          baseUrl: baseUrl as string,
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

    process: ({ data: { model, baseUrl, token } }) => ({
      model: {
        url: new URL(pathCompletions, baseUrl).toString(),
        model,
        token,
        getBody,
        onError,
        onData,
      } as LanguageModel<T, U>,
    }),
  })
}
