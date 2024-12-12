import { defineModule } from '@nwrx/core'
import * as nodes from './nodes'

export const Serpapi = defineModule({
  kind: 'serpapi',
  name: 'Serpapi',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Perform searches on various search engines.',
  nodes: { ...nodes },
})
