import { lmTypeModel } from './lmTypeModel'
import { coreTypeString } from '../core'
import { defineChainNode } from '../chain/defineChainNode'

export const lmNodeInference = defineChainNode({
  name: 'lm:inference',
  label: 'LM Inference',
  icon: 'https://api.iconify.design/carbon:ai.svg',
  description: 'Generates a completion based on a language model.',

  defineDataSchema: () => ({
    model: {
      name: 'Model',
      type: lmTypeModel,
    },
    prompt: {
      name: 'Prompt',
      type: coreTypeString,
    },
  }),

  defineResultSchema: () => ({
    completion: {
      name: 'Completion',
      type: coreTypeString,
    },
  }),

  process: ({ data }) => {
    const { model, prompt } = data
    return { completion: 'Hello, world!', model, prompt }
  },
})
