import { defineFlowModule } from '@nwrx/core'
import * as NODES from './nodes'
import * as TYPES from './types'

export default defineFlowModule({
  kind: 'nwrx/core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: Object.values(NODES),
  types: Object.values(TYPES),
})
