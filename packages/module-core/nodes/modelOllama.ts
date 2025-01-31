import type { NodeInstanceContext, SocketListOption } from '@nwrx/core'
import { defineDataSchema, defineNode } from '@nwrx/core'
import { languageModel } from '../categories'
import { languageModelInstance, string } from '../types'

/** The default BASE_URL for the Ollama API. */
const BASE_URL = 'http://localhost:11434'

interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
  details: {
    format: 'gguf'
    family: 'llama'
    families: null
    parameter_size: string
    quantization_level: string
  }
}

interface OllamaTagsResponse {
  models: OllamaModel[]
}

interface OllamaChatResponse {
  model: string
  created_at: string
  message: {
    role: 'assistant' | 'user'
    content: string
  }
  done: boolean
  total_duration: number
  load_duration: number
  prompt_eval_count: number
  prompt_eval_duration: number
  eval_count: number
  eval_duration: number
}

export const modelOllama = defineNode({
  kind: 'ollama-api',
  name: 'Ollama API',
  icon: 'https://api.iconify.design/simple-icons:ollama.svg',
  description: 'Generates a completion based on the OpenAI language model.',
  category: languageModel,

  // --- Define the inputs of the node.
  dataSchema: async({ data, abortSignal }: NodeInstanceContext) => {
    const dataSchema = defineDataSchema({
      baseUrl: {
        type: string,
        label: 'Base URL',
        control: 'variable',
        description: 'The base URL of the Ollama API.',
        isOptional: true,
      },
      model: {
        type: string,
        label: 'Model Name',
        control: 'select',
        description: 'The name of the model to use for generating completions.',
        options: [] as Array<SocketListOption<string>>,
      },
    })

    // --- Attempt to fill the model names from the API.
    try {
      const { baseUrl = BASE_URL } = data as Record<string, string>
      const url = new URL('/api/tags', baseUrl)
      const response = await fetch(url.href, { signal: abortSignal })
      const models = await response.json() as OllamaTagsResponse
      dataSchema.model.options = models.models.map(x => ({
        value: x.name,
        label: x.name,
        description: `Size: ${x.details.parameter_size} | Quantization: ${x.details.quantization_level}`,
        icon: 'https://api.iconify.design/simple-icons:ollama.svg',
      }))
    }
    catch { /* Ignore errors */ }

    // --- Return the data schema.
    return dataSchema
  },

  // --- Define the outputs of the node.
  resultSchema: {
    model: {
      name: 'Model',
      type: languageModelInstance,
      description: 'The model information to use for generating completions.',
    },
  },

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: async({ data, abortSignal }) => {
    const { baseUrl = BASE_URL } = data

    // --- Check the API is accessible and the model name is valid.
    const url = new URL('/api/tags', baseUrl)
    const response = await fetch(url.href, { signal: abortSignal })

    // --- Check if the API key is authorized.
    if (!response.ok) {
      const errorObject = await response.json().catch(() => {}) as { error: { message: string } } | undefined
      throw new Error(errorObject?.error?.message ?? `Could not access the Ollama API: ${response.statusText}`)
    }

    // --- Check if the model name is valid.
    const models = await response.json() as OllamaTagsResponse
    const modelExists = models.models.some(x => x.name === data.model)
    if (!modelExists) throw new Error(`Could not find the model with the name "${data.model}".`)

    // --- Return the model information.
    return {
      model: {
        url: new URL('/api/chat', baseUrl).href,
        model: data.model,
        token: undefined,
        getBody: ({ prompt }) => ({
          stream: false,
          model: data.model,
          messages: [{ role: 'user', content: prompt }],
        }),
        getCompletion: (response: OllamaChatResponse) => {
          const { message, eval_count, prompt_eval_count, created_at } = response
          return {
            completion: message.content,
            fingerprint: created_at,
            tokensPrompt: prompt_eval_count,
            tokensCompletion: eval_count,
            tokensTotal: prompt_eval_count + eval_count,
          }
        },
      },
    }
  },
})
