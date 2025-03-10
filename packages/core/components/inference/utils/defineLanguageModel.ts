import type { ComponentOptions, SchemaOption } from '../../../utils'
import type { LanguageModel } from './languageModelSchema'
import { defineComponent } from '../../../utils/defineComponent'
import { joinUrl } from './joinUrl'
import { languageModelSchema } from './languageModelSchema'

export interface LanguageModelSearchModelsOptions {
  token?: string
  query?: string
  baseUrl: string
  pathModels: string
}

export interface LanguageModelOptions extends ComponentOptions, Pick<LanguageModel, 'onRequest' | 'onResponse'> {
  pathModels: string
  pathCompletions: string
  allowCustomBaseUrl?: boolean
  allowCustomModelId?: boolean
  allowCustomToken?: boolean
  defaultBaseUrl?: string
  defaultModelId?: string
  searchModels?: (options: LanguageModelSearchModelsOptions) => Promise<SchemaOption[]>
}

export function defineLanguageModel(options: LanguageModelOptions) {
  return defineComponent(
    {
      isTrusted: true,
      inputs: {
        baseUrl: {
          'type': 'string',
          'title': 'URL',
          'description': 'The base URL for the inference provider.',
          'default': options.defaultBaseUrl,
          'x-control': 'variable',
          'x-internal': !options.allowCustomBaseUrl && Boolean(options.defaultBaseUrl),
          'x-optional': Boolean(options.defaultBaseUrl),
        },
        token: {
          'type': 'string',
          'title': 'API Key',
          'description': 'The API Key used to authenticate with the inference provider.',
          'x-control': 'variable',
          'x-optional': !options.allowCustomToken,
          'x-internal': !options.allowCustomToken,
        },
        model: {
          'type': 'string',
          'title': 'Model',
          'description': 'The name of the model to use for generating completions.',
          'default': options.defaultModelId,
          'x-control': options.searchModels ? 'select' : 'text',
          'x-internal': !options.allowCustomModelId && Boolean(options.defaultModelId),
          'x-optional': Boolean(options.defaultModelId),
          'x-options': options.searchModels
            ? (data, query) => options.searchModels!({
              pathModels: options.pathModels,
              baseUrl: data.baseUrl as string,
              token: data.token as string,
              query,
            })
            : undefined,
        },
        ...options.inputs,
      },
      outputs: {
        model: {
          title: 'Model',
          description: 'The model information to use for generating completions.',
          ...languageModelSchema,
        },
        ...options.outputs,
      },
    },
    ({ data }) => ({
      model: {
        url: joinUrl(data.baseUrl, options.pathCompletions),
        model: data.model,
        onRequest: context => options.onRequest(context, data.token),
        onResponse: options.onResponse,
      },
    }),
  )
}
