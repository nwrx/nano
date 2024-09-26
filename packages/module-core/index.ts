import { defineFlowModule } from '@nwrx/core'
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

export default defineFlowModule({
  kind: 'nwrx/core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: [
    nodeInput,
    nodeOutput,
    nodeTemplate,
    nodeModelOllama,
    nodeModelOpenai,
    nodeInference,
    nodeJsonParse,
  ],
  types: [
    typeBoolean,
    typeNumber,
    typeObject,
    typeStream,
    typeModel,
  ],
})
