import { defineModule } from '@nwrx/core'
import {
  nodeGate,
  nodeInference,
  nodeInput,
  nodeModelGroq,
  nodeModelOpenai,
  nodeOutput,
  nodeParse,
  nodeTemplate,
  toolWeather,
} from './nodes'
// export * from './categories'
// export * from './nodes'
// export * from './types'
// export * from './utils'

export const Core = defineModule({
  kind: 'core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: {
    nodeGate,
    nodeInput,
    nodeInference,
    nodeModelGroq,
    nodeModelOpenai,
    nodeOutput,
    nodeParse,
    nodeTemplate,
    toolWeather,
  },
})
