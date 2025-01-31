import { defineFlowNode } from '@nwrx/core'
import { assertStringNotEmpty } from '@unshared/validation'
import { categoryLm } from './categoryLmModels'
import { typeModel } from './typeModel'
import { typeString } from './typeString'

export const nodeModelOllama = defineFlowNode({
  kind: 'ollama-api',
  name: 'Ollama API',
  icon: 'https://api.iconify.design/simple-icons:ollama.svg',
  description: 'Generates a completion from an Ollama API instance.',
  category: categoryLm,

  // --- Define the inputs of the node.
  defineDataSchema: {
    apiKey: {
      name: 'API Key',
      display: 'text',
      type: typeString,
      disallowStatic: true,
      disallowDynamic: true,
      description: 'The API key for the Ollama API.',
    },
    endpoint: {
      name: 'Endpoint',
      display: 'text',
      type: typeString,
      disallowStatic: true,
      disallowDynamic: true,
      description: 'The endpoint for the Ollama API.',
    },
    modelName: {
      name: 'Model Name',
      display: 'text',
      type: typeString,
      disallowDynamic: true,
      description: 'The name of the model to use for generating completions.',
    },
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
