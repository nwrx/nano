import { defineFlowModule } from '@nanoworks/core'
import { nodeInference } from './nodeInference'
import { nodeInput } from './nodeInput'
import { nodeJsonParse } from './nodeJsonParse'
import { nodeModelOllama } from './nodeModelOllama'
import { nodeModelOpenai } from './nodeModelOpenai'
import { nodeOutput } from './nodeOutput'
import { nodeTemplate } from './nodeTemplate'
import { typeBoolean } from './typeBoolean'
import { typeModel } from './typeModel'
import { typeNumber } from './typeNumber'
import { typeObject } from './typeObject'
import { typeStream } from './typeStream'
import { typeString } from './typeString'

export default defineFlowModule({
  kind: 'core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: {
    Input: nodeInput,
    Output: nodeOutput,
    Template: nodeTemplate,
    ModelOllama: nodeModelOllama,
    ModelOpenai: nodeModelOpenai,
    Inference: nodeInference,
    JsonParse: nodeJsonParse,
  },
  types: {
    Boolean: typeBoolean,
    Number: typeNumber,
    String: typeString,
    Stream: typeStream,
    Object: typeObject,
    Model: typeModel,
  },
})
