import type { InstanceContext, SocketListOption, Type } from '@nwrx/core'
import type { LanguageModel } from '../types'
import { defineDataSchema, defineNode } from '@nwrx/core'
import { categoryLanguageModel } from '../categories'
import { languageModel, string } from '../types'

interface LanguageModelNodeData {
  url: string
  model: string
  token: string
}

interface CreateLanguageModelNodeOptions<T, U> extends Pick<LanguageModel<T, U>, 'getBody' | 'onData' | 'onError'> {
  name: string
  kind: string
  icon: string
  baseUrl?: string
  description: string
  defaultModel?: string
  getModelOptions: (data: LanguageModelNodeData, abortSignal: AbortSignal) => Promise<Array<SocketListOption<string>>>
}

/**
 * Wrapper around the {@linkcode defineNode} function that creates a standardized
 * language model node for a specific API. The function takes-in several options
 * that streamline the process of adapting the node to different inference providers.
 *
 * @param options The options for creating the language model node.
 * @returns The language model node.
 */
export function defineNodeLanguageModel<T, U>(options: CreateLanguageModelNodeOptions<T, U>) {
  return defineNode({
    kind: options.kind,
    name: options.name,
    icon: options.icon,
    description: options.description,
    category: categoryLanguageModel,

    dataSchema: async({ data, abortSignal }: InstanceContext) => defineDataSchema({
      baseUrl: {
        name: 'URL',
        type: string,
        control: 'variable',
        description: 'The base URL for the inference provider.',
        defaultValue: options.baseUrl,
        isInternal: Boolean(options.baseUrl),
        isOptional: Boolean(options.baseUrl),
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
        name: 'Model Name',
        defaultValue: options.defaultModel,
        description: 'The name of the model to use for generating completions.',
        options: await options.getModelOptions(data as LanguageModelNodeData, abortSignal).catch(() => []),
      },
    }),

    resultSchema: {
      model: {
        name: 'Model',
        type: languageModel as Type<LanguageModel<T, U>>,
        description: 'The model information to use for generating completions.',
      },
    },

    process: ({ data }) => ({
      model: {
        url: data.baseUrl,
        model: data.model,
        token: data.token,
        getBody: options.getBody,
        onError: options.onError,
        onData: options.onData,
      },
    }),
  })
}
