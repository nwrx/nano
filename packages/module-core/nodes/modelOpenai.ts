import type { NodeInstanceContext, SocketListOption } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { defineDataSchema } from '@nwrx/core'
import { languageModel } from '../categories'
import { languageModelInstance, string } from '../types'

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

export const modelOpenai = defineNode({
  kind: 'openai-api',
  name: 'OpenAI API',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **OpenAI API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the OpenAI API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
  category: languageModel,

  // --- Define the inputs of the node.
  dataSchema: async({ data, abortSignal }: NodeInstanceContext) => {
    const dataSchema = defineDataSchema({
      token: {
        name: 'API Key',
        type: string,
        control: 'variable',
        description: 'The API key for the OpenAI API.',
      },
      model: {
        type: string,
        control: 'select',
        name: 'Model Name',
        description: 'The name of the model to use for generating completions.',
        options: [] as Array<SocketListOption<string>>,
      },
    })

    // --- Attempt to fill the model names from the API.
    try {
      const { token = '' } = data as Record<string, string>
      const url = new URL('/v1/models', OPENAI_BASE_URL)
      const response = await fetch(url.href, { signal: abortSignal, headers: { Authorization: `Bearer ${token}` } })
      const models = await response.json() as OpenaiModelResponse
      dataSchema.model.options = models.data.filter(x => x.object === 'model').map(x => ({
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
    const { token, model } = data
    if (!token) throw new Error('Please provide your OpenAI API key to access the API.')
    if (!model) throw new Error('Please select the model name to use for generating completions.')

    // --- Check the API is accessible and the model name is valid.
    const url = new URL('/v1/models', OPENAI_BASE_URL)
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
        url: new URL('/v1/chat/completions', OPENAI_BASE_URL).href,
        model,
        token,
        getBody: ({ prompt }) => ({
          model: data.model,
          messages: [{ role: 'user', content: prompt }],
        }),
        getCompletion: (response: OpenaiChatResponse) => {
          const { choices, system_fingerprint, usage } = response
          return {
            completion: choices.find(x => x.finish_reason === 'stop')?.message.content ?? '',
            fingerprint: system_fingerprint,
            tokensTotal: usage.total_tokens,
            tokensPrompt: usage.prompt_tokens,
            tokensCompletion: usage.completion_tokens,
          }
        },
      },
    }
  },
})
