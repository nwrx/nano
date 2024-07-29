import { lmTypeModel } from './lmTypeModel'
import { coreTypeString } from '../core'
import { defineChainNode } from '../chain'

export const lmNodeModelOpenai = defineChainNode({
  name: 'lm:model:openai',
  label: 'OpenAI API',
  icon: 'https://api.iconify.design/carbon:ai.svg',
  description: 'Generates a completion based on the OpenAI language model.',

  // --- Define the inputs of the node.
  defineDataSchema: () => ({
    apiKey: {
      name: 'API Key',
      type: coreTypeString,
      description: 'The API key for the OpenAI API.',
    },
    modelName: {
      name: 'Model Name',
      type: coreTypeString,
      description: 'The name of the model to use for generating completions.',
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
  process: () => {
    // const a = this.resolveData()
    // this.setResultValue('test', 'test')
  },
})
