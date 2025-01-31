import { defineModule } from '@nwrx/core'
import { nodeModelOpenai } from './nodeModelOpenai'

export default defineModule({
  kind: 'nwrx/openai',
  name: 'OpenAI',
  icon: 'https://api.iconify.design/logos:openai-icon.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: [nodeModelOpenai],
})
