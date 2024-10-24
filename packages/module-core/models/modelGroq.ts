import type { NodeInstanceContext, SocketListOption } from '@nwrx/core'
import { defineNode } from '@nwrx/core'
import { defineDataSchema } from '@nwrx/core'
import { languageModel } from '../categories'
import { languageModel, string } from '../types'

const GROQ_BASE_URL = 'https://api.groq.com'
const GROQ_MODEL_OWNER_ICON: Record<string, string> = {
  'Mistral AI': 'https://api.iconify.design/logos:mistral-ai-icon.svg',
  'Meta': 'https://api.iconify.design/logos:meta-icon.svg',
  'OpenAI': 'https://api.iconify.design/simple-icons:openai.svg',
  'Other': 'https://api.iconify.design/carbon:flow-stream.svg',
  'Google': 'https://api.iconify.design/logos:google-icon.svg',
  'Groq': 'https://api.iconify.design/prime:sparkles.svg',
  'Hugging Face': 'https://api.iconify.design/logos:hugging-face-icon.svg',
  'Microsoft': 'https://api.iconify.design/logos:microsoft-icon.svg',
}

interface GroqModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface GroqModelResponse {
  object: 'list'
  data: GroqModel[]
}

interface GroqChatResponse {
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

export const modelGroq = defineNode({
  kind: 'groq-api',
  name: 'Groq API',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'The **Groq API** node is designed to retreive a **Language Model Instance** that can be used to generate completions using the Groq API. The node requires an API key and a model name as input, and returns the model information required for generating completions.',
  category: languageModel,

  // --- Define the inputs of the node.
  dataSchema: async({ data, abortSignal }: NodeInstanceContext) => {
    const dataSchema = defineDataSchema({
      token: {
        name: 'API Key',
        type: string,
        control: 'variable',
        description: 'The API Key for the Groq Console API.',
      },
      model: {
        name: 'Model Name',
        type: string,
        control: 'select',
        description: 'The name of the model to use for generating completions.',
        options: [] as Array<SocketListOption<string>>,
      },
    })

    // --- Attempt to fill the model names from the API.
    try {
      const { token = '' } = data as Record<string, string>
      const url = new URL('/openai/v1/models', GROQ_BASE_URL)
      const response = await fetch(url.href, { signal: abortSignal, headers: { Authorization: `Bearer ${token}` } })
      const models = await response.json() as GroqModelResponse
      dataSchema.model.options = models.data.filter(x => x.object === 'model').map(x => ({
        value: x.id,
        label: x.id,
        description: x.owned_by,
        icon: GROQ_MODEL_OWNER_ICON[x.owned_by],
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
      type: languageModel,
      description: 'The model information to use for generating completions.',
    },
  },

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: async({ data, abortSignal }) => {
    const { token, model } = data
    const url = new URL('/openai/v1/models', GROQ_BASE_URL)
    const response = await fetch(url.href, {
      headers: { Authorization: `Bearer ${token}` },
      signal: abortSignal,
    })

    // --- Check if the API key is authorized.
    if (!response.ok) {
      const errorObject = await response.json().catch(() => {}) as { error: { message: string } } | undefined
      throw new Error(errorObject?.error?.message ?? `Could not access the Groq API: ${response.statusText}`)
    }

    // --- Check if the model name is valid.
    const models = await response.json() as GroqModelResponse
    const modelExists = models.data.some(x => x.id === data.model)
    if (!modelExists) throw new Error(`Could not find the model with the name "${data.model}".`)

    // --- Return the model information.
    return {
      model: {
        url: new URL('/openai/v1/chat/completions', GROQ_BASE_URL).href,
        model,
        token,
        getBody: ({ prompt, maxCompletionTokens, temperature }) => ({
          model: data.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxCompletionTokens,
          temperature,
        }),
        getCompletion: (response: GroqChatResponse) => {
          const { choices, usage, system_fingerprint } = response
          return {
            completion: choices.map(x => x.message.content).join(' '),
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
