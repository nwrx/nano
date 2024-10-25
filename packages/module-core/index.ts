import { defineModule } from '@nwrx/core'
import * as nodes from './nodes'
import * as types from './types'

export * from './categories'
export * from './nodes'
export * from './types'
export * from './utils'

export default defineModule({
  kind: 'nwrx/core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: Object.values(nodes),
  types: Object.values(types),
})
