import { lmTypeModel } from './lmTypeModel'
import { lmNodeModelOpenai } from './lmNodeModelOpenai'
import { lmNodeModelOllama } from './lmNodeModelOllama'
import { lmNodeInference } from './lmNodeInference'
import { defineChainModule } from '../chain'

export const coreModule = defineChainModule({
  name: 'lm',
  label: 'Language Models',
  description: 'Nodes and types for working with language models providers.',
  nodes: {
    lmNodeInference,
    lmNodeModelOllama,
    lmNodeModelOpenai,
  },
  types: {
    lmTypeModel,
  },
})
