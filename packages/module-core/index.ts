import { defineModule } from '@nwrx/core'
import { inference, languageModel, languageModelTool, modelOpenai, toolWeather } from './models'
import * as NODES from './nodes'
import * as TYPES from './types'

export default defineModule({
  kind: 'nwrx/core',
  name: 'Core',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Basic nodes and types for building automation flows.',
  nodes: [
    ...Object.values(NODES),
    inference,
    modelOpenai,
    toolWeather,
  ],
  types: [
    ...Object.values(TYPES),
    languageModel,
    languageModelTool,
  ],
})
