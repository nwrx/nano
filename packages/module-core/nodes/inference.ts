import { defineNode } from '@nwrx/core'
import { compute } from '../categories'
import { languageModelInstance, string } from '../types'

export const inference = defineNode({
  kind: 'inference',
  name: 'Inference',
  icon: 'https://api.iconify.design/carbon:ai.svg',
  description: 'Generates a completion based on a language model.',
  category: compute,

  dataSchema: {
    model: {
      name: 'Model',
      control: 'socket',
      type: languageModelInstance,
      description: 'The language model used to generate the completion.',
    },
    prompt: {
      type: string,
      name: 'Prompt',
      control: 'socket',
      description: 'The message to generate a completion for.',
    },
  },

  resultSchema: {
    completion: {
      type: string,
      name: 'Completion',
      description: 'The generated completion based on the prompt.',
    },
  },

  process: async({ data }) => {
    const { model, prompt } = data

    // --- Generate the completion based on the model and prompt.
    const body = model.getBody({ prompt })
    const response = await fetch(model.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${model.token}`,
      },
      body: JSON.stringify(body),
    })

    // --- Handle the response status.
    if (!response.ok) {
      const errorObject = await response.json().catch(() => {}) as { error: { message: string } } | undefined
      throw new Error(errorObject?.error?.message ?? `Could not generate the completion: ${response.statusText}`)
    }

    // --- Return the completion from the response.
    const responseData = await response.json() as unknown
    return { completion: model.getCompletion(responseData) }
  },
})
