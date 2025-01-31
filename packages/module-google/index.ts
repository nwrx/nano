import { defineModule } from '@nwrx/core'
import * as nodesDrive from './drive'
import * as nodesSheet from './sheet'

export const Google = defineModule({
  kind: 'google',
  name: 'Google',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: { ...nodesDrive, ...nodesSheet },
})
