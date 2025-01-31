import { defineModule } from '@nwrx/core'
import { modelOpenai } from './modelOpenai'

export default defineModule({
  kind: 'nwrx/openai',
  name: 'OpenAI',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: [modelOpenai],
})
