import { defineFlowNode } from '@nanoworks/core'
import { typeModel } from './typeModel'
import { typeString } from './typeString'

interface OpenaiModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface OpenaiModelList {
  object: 'list'
  data: OpenaiModel[]
}

export const nodeModelOpenai = defineFlowNode({
  kind: 'openai-api',
  name: 'OpenAI API',
  icon: 'https://api.iconify.design/simple-icons:openai.svg',
  description: 'Generates a completion based on the OpenAI language model.',

  // --- Define the inputs of the node.
  defineDataSchema: async({ data }) => {

    // --- Fetch the list of models from the OpenAI API.
    let modelIds: string[] = ['gpt-4o']
    const apiKey = (data as { apiKey: string }).apiKey
    if (apiKey) {
      const response = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${apiKey}` } })
      const modelList = await response.json() as OpenaiModelList
      modelIds = modelList.data.filter(x => x.object === 'model').map(x => x.id)
    }

    return {
      apiKey: {
        name: 'API Key',
        type: typeString,
        display: 'text',
        disallowDynamic: true,
        description: 'The API key for the OpenAI API.',
      },
      modelName: {
        name: 'Model Name',
        type: typeString,
        display: 'select',
        disallowDynamic: true,
        description: 'The name of the model to use for generating completions.',
        values: modelIds,
      },
    }
  },

  // --- Define the outputs of the node.
  defineResultSchema: {
    model: {
      name: 'Model',
      type: typeModel,
      description: 'The model information to use for generating completions.',
    },
  },

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: async({ data, abortSignal }) => {
    if (!data.apiKey) return
    if (!data.modelName) return

    // --- Check if the API key and model name are valid.
    const response = await fetch('https://api.openai.com/v1/models', {
      signal: abortSignal,
      headers: { Authorization: `Bearer ${data.apiKey}` },
    })

    // --- Throw an error if the API key is invalid or the model name is not found.
    if (!response.ok) throw new Error('Invalid API key')
    const modelList = await response.json() as OpenaiModelList
    if (!modelList.data.some(x => x.id === data.modelName)) throw new Error('Invalid model name')

    // --- Return the model information.
    return {
      model: {
        apiKey: data.apiKey,
        modelName: data.modelName,
        endpoint: 'https://api.openai.com/v1/engines/gpt-3/completions',
      },
    }
  },
})
