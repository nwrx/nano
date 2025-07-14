import { defineProvider } from '../utils'
import { openaiCompatible } from './openai'

export const azureOpenai = defineProvider({
  ...openaiCompatible,
  name: 'azure-openai',
  baseUrl: 'https://{resourceName}.openai.azure.com/openai/deployments/{deploymentName}',
  parameters: {
    apiKey: {
      path: 'API-Key',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.AZURE_OPENAI_API_KEY,
      },
    },
    resourceName: {
      path: 'resourceName',
      location: 'path',
      schema: {
        type: 'string',
        required: true,
        default: process.env.AZURE_OPENAI_RESOURCE_NAME,
      },
    },
    deploymentName: {
      path: 'deploymentName',
      location: 'path',
      schema: {
        type: 'string',
        required: true,
        default: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      },
    },
    apiVersion: {
      path: 'api-version',
      location: 'query',
      schema: {
        type: 'string',
        required: true,
        default: '2024-02-15-preview',
      },
    },
  },
})
