import type { FlowNodeContext } from '@nwrx/core'
import { defineFlowNode } from '@nwrx/core'
import { lmModel } from '../categories'
import { model, string } from '../types'

const OPENAI_BASE_URL = 'https://api.openai.com/v1'

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

export const modelOpenai = defineFlowNode({
  kind: 'openai-api',
  name: 'OpenAI API',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'Generates a completion based on the OpenAI language model.',
  category: lmModel,

  // --- Define the inputs of the node.
  defineDataSchema: async({ data, abortSignal }: FlowNodeContext) => {

    // --- Fetch the list of models from the OpenAI API.
    const token = data.token as string
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: token ? { Authorization: `Bearer ${token}` }: undefined,
      signal: abortSignal,
    })

    // --- If the models could not be fetched, return an empty list.
    const models = (response.ok ? await response.json() : { data: [] }) as OpenaiModelResponse

    // --- Return the model names as a select input.
    return {
      token: {
        name: 'API Key',
        type: string,
        display: 'text',
        disallowStatic: true,
        disallowDynamic: true,
        description: 'The API key for the OpenAI API.',
      },
      model: {
        name: 'Model Name',
        type: string,
        display: 'select',
        disallowDynamic: true,
        description: 'The name of the model to use for generating completions.',
        values: models.data.filter(x => x.object === 'model').map(x => ({
          value: x.id,
          label: x.id,
          description: x.owned_by,
          icon: 'https://api.iconify.design/simple-icons:openai.svg',
        })),
      },
    }
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
    const { token, model } = data
    if (!token) throw new Error('Please provide your OpenAI API key to access the API.')
    if (!model) throw new Error('Please select the model name to use for generating completions.')

    // --- Check the API is accessible and the model name is valid.
    const response = await fetch('https://api.openai.com/v1/models', {
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
        url: new URL('/v1/chat/completions', OPENAI_BASE_URL).href,
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
