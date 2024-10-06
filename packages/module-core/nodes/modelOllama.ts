import type { FlowNodeContext, FlowNodePortValue, FlowSchema } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { lmModel } from '../categories'
import { model, string } from '../types'

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

export const modelOllama = defineFlowNode({
  kind: 'ollama-api',
  name: 'Ollama API',
  icon: 'https://api.iconify.design/simple-icons:ollama.svg',
  description: 'Generates a completion based on the OpenAI language model.',
  category: lmModel,

  // --- Define the inputs of the node.
  defineDataSchema: async({ data, abortSignal }: FlowNodeContext) => {
    const dataSchema = {
      baseUrl: {
        type: string,
        name: 'Base URL',
        description: 'The base URL of the Ollama API.',
        disallowStatic: true,
        disallowDynamic: true,
      },
      model: {
        type: string,
        display: 'select',
        name: 'Model Name',
        description: 'The name of the model to use for generating completions.',
        disallowDynamic: true,
        values: [] as Array<FlowNodePortValue<string>>,
      },
    } satisfies FlowSchema

    // --- Attempt to fill the model names from the API.
    try {
      const { baseUrl = 'http://localhost:11434' } = data as Record<string, string>
      const url = new URL('/api/tags', baseUrl)
      const response = await fetch(url.href, { signal: abortSignal })
      const models = await response.json() as OllamaTagsResponse
      dataSchema.model.values = models.models.map(x => ({
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
  defineResultSchema: {
    model: {
      name: 'Model',
      type: model,
      description: 'The model information to use for generating completions.',
    },
  },

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: async({ data, abortSignal }) => {
    const { baseUrl, model } = data
    if (!baseUrl) throw new Error('Please provide the base URL of the Ollama API.')
    if (!model) throw new Error('Please select the model name to use for generating completions.')

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
    if (!modelExists) throw new Error(`Could not find the model with the name "${model}".`)

    // --- Return the model information.
    return {
      model: {
        url: new URL('/api/chat', baseUrl).href,
        model,
        token: undefined,
        getBody: ({ prompt }) => ({
          stream: false,
          model: data.model,
          message: { role: 'user', content: prompt },
        }),
        getCompletion: ({ message }: OllamaChatResponse) =>
          message.content,
      },
    }
  },
})
