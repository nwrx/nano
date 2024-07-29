import { assertStringNotEmpty } from 'unshared'
import { lmTypeModel } from './lmTypeModel'
import { coreTypeString } from '../core'
import { defineChainNode } from '../chain'

export const lmNodeModelOllama = defineChainNode({
  name: 'lm:model:ollama',
  label: 'Ollama API',
  icon: 'https://api.iconify.design/carbon:ai.svg',
  description: 'Generates a completion from an Ollama API instance.',

  // --- Define the inputs of the node.
  defineDataSchema: () => ({
    apiKey: {
      name: 'API Key',
      type: coreTypeString,
      description: 'The API key for the Ollama API.',
    },
    modelName: {
      name: 'Model Name',
      type: coreTypeString,
      description: 'The name of the model to use for generating completions.',
    },
    endpoint: {
      name: 'Endpoint',
      type: coreTypeString,
      description: 'The endpoint for the Ollama API.',
    },
  }),

  // --- Define the outputs of the node.
  defineResultSchema: () => ({
    model: {
      name: 'Model',
      type: lmTypeModel,
      description: 'The model information to use for generating completions.',
    },
  }),

  // --- On processing the node, check the API key and model name
  // --- are valid and return the model information.
  process: ({ data }) => {
    const { apiKey, modelName, endpoint } = data
    assertStringNotEmpty(apiKey)
    assertStringNotEmpty(modelName)
    assertStringNotEmpty(endpoint)
    return {
      model: {
        apiKey,
        modelName,
        endpoint,
      },
    }
  },
})
