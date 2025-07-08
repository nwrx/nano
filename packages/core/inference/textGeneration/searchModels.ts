import type { Provider } from '../createProvider'
import { applyParameters, joinUrl } from '../utils'

export async function searchModels(this: Provider, parameters?: Record<string, unknown>): Promise<unknown> {
  const { provider: options, options: providerParameters = {} } = this
  const { baseUrl, features, parameters: providerMappings = [] } = options

  // --- Assure the provider supports searching models.
  if (!features) throw new Error('The provider does not support searching models.')
  if (!features.searchModels) throw new Error('The provider does not support searching models.')
  const { path, parameters: featureMappings = [] } = features.searchModels

  // --- Fetch the models available for the API.
  if (!path) throw new Error('The provider does not support searching models.')
  const url = joinUrl(baseUrl, path)
  const init = { method: 'GET' }

  // --- Apply the mappings and parameters to the request.
  const allMappings = [...providerMappings, ...featureMappings]
  const allParameters = { ...providerParameters, ...parameters }
  applyParameters({ url, init, parameters: allMappings, options: allParameters })

  const response = await fetch(url, init)
  return await response.json()
}
