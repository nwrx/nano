import { assertString, createParser } from 'unshared'
import { defineChainType } from '../chain'

interface LmModel {
  apiKey: string
  endpoint: string
  modelName: string
}

export const lmTypeModel = defineChainType<LmModel>({
  name: 'lm:model',
  label: 'LM Model',
  color: '#cb7fff',
  description: 'An instance of a language model used to infer completions of text.',
  parse: createParser({
    apiKey: assertString,
    endpoint: assertString,
    modelName: assertString,
  }),
})
