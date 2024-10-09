import type { FlowNodeContext, FlowNodePortValue, FlowSchema } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { languageModel } from '../categories'
import { languageModelInstance, string } from '../types'

const GROQ_BASE_URL = 'https://api.groq.com'

interface OpenaiModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface OpenaiModelResponse {
  object: 'list'
  data: OpenaiModel[]
}

interface OpenaiChatResponse {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
  choices: Array<{
    index: number
    message: {
      role: 'assistant' | 'user'
      content: string
    }
    logprobs: null
    finish_reason: 'stop'
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    completion_tokens_details: {
      reasoning_tokens: number
    }
  }
}

export const modelGroq = defineFlowNode({
  kind: 'groq-api',
  name: 'Groq API',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'Generates a completion based on the OpenAI language model.',
  category: languageModel,

  // --- Define the inputs of the node.
  defineDataSchema: async({ data, abortSignal }: FlowNodeContext) => {
    const dataSchema = {
      token: {
        name: 'API Key',
        type: string,
        display: 'text',
        disallowStatic: true,
        disallowDynamic: true,
        description: 'The API key for the OpenAI API.',
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
      const { token = '' } = data as Record<string, string>
      const url = new URL('/openai/v1/models', GROQ_BASE_URL)
      const response = await fetch(url.href, { signal: abortSignal, headers: { Authorization: `Bearer ${token}` } })
      const models = await response.json() as OpenaiModelResponse
      dataSchema.model.values = models.data.filter(x => x.object === 'model').map(x => ({
        value: x.id,
        label: x.id,
        description: x.owned_by,
        icon: 'https://api.iconify.design/simple-icons:openai.svg',
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
      type: languageModelInstance,
      description: 'The model information to use for generating completions.',
    },
  },

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: async({ data, abortSignal }) => {
    const { token, model } = data
    if (!token) throw new Error('Please provide your OpenAI API key to access the API.')
    if (!model) throw new Error('Please select the model name to use for generating completions.')

    // --- Check the API is accessible and the model name is valid.
    const url = new URL('/openai/v1/models', GROQ_BASE_URL)
    const response = await fetch(url.href, {
      headers: { Authorization: `Bearer ${token}` },
      signal: abortSignal,
    })

    // --- Check if the API key is authorized.
    if (!response.ok) {
      const errorObject = await response.json().catch(() => {}) as { error: { message: string } } | undefined
      throw new Error(errorObject?.error?.message ?? `Could not access the OpenAI APIy: ${response.statusText}`)
    }

    // --- Check if the model name is valid.
    const models = await response.json() as OpenaiModelResponse
    const modelExists = models.data.some(x => x.id === data.model)
    if (!modelExists) throw new Error(`Could not find the model with the name "${data.model}".`)

    // --- Return the model information.
    return {
      model: {
        url: new URL('/openai/v1/chat/completions', GROQ_BASE_URL).href,
        model,
        token,
        getBody: ({ prompt }) => ({
          model: data.model,
          messages: [{ role: 'user', content: prompt }],
        }),
        getCompletion: ({ choices }: OpenaiChatResponse) => {
          const choice = choices.find(x => x.finish_reason === 'stop')
          return choice?.message.content ?? ''
        },
      },
    }
  },
})
