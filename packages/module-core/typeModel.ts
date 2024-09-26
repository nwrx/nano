import { defineFlowType } from '@nwrx/core'
import { assertString, createParser } from '@unshared/validation'

export const typeModel = defineFlowType({
  kind: 'lm-model',
  name: 'LM Model',
  color: '#CB7fff',
  description: 'An instance of a language model used to infer completions of text.',
  parse: createParser({
    apiKey: assertString,
    endpoint: assertString,
    modelName: assertString,
  }),
})
