import { defineModule } from '@nwrx/core'
import * as nodesLegifrance from './legifrance'

export const Legifrance = defineModule({
  kind: 'legifrance',
  name: 'Legifrance',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Interact with the Legifrance API',
  nodes: { ...nodesLegifrance },
})
