import { defineFlowNode } from '@nanoworks/core'
import { typeModel } from './typeModel'
import { typeString } from './typeString'

export const nodeInference = defineFlowNode({
  kind: 'inference',
  name: 'Inference',
  icon: 'https://api.iconify.design/carbon:ai.svg',
  description: 'Generates a completion based on a language model.',

  defineDataSchema: {
    model: {
      name: 'Model',
      type: typeModel,
    },
    prompt: {
      name: 'Prompt',
      type: typeString,
    },
  },

  defineResultSchema: {
    completion: {
      name: 'Completion',
      type: typeString,
    },
  },

  process: ({ data }) => {
    const { model, prompt } = data
    return { completion: 'Hello, world!', model, prompt }
  },
})
