import { Schema, defineChainNode } from '@maestrau/core'
import { coreTypeString } from './coreTypeString'
import { coreTypeObject } from './coreTypeObject'

export const nodeEntrypoint = defineChainNode({
  name: 'core:entrypoint',
  label: 'Entrypoint',
  icon: 'https://api.iconify.design/carbon:arrow-right.svg',
  description: 'The entrypoint of the chain that receives the input data.',

  defineDataSchema: () => ({
    schema: {
      name: 'Schema',
      type: coreTypeObject,
      description: 'The schema of the input data.',
    },
  }),

  defineResultSchema: ({ schema }) => {
    if (!schema) return {}
    const keys = Object.keys(schema)
    const outputs: Schema = {}
    for (const key of keys) {
      outputs[key] = {
        name: key,
        type: coreTypeString,
      }
    }
    return outputs
  },

  process: () => ({
    apiKey: '123',
    modelName: 'gpt-3',
  }),
})
