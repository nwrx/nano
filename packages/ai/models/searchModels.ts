import type { Client } from '../createClient'
import type { Provider } from '../utils'
import type { Models } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters, joinUrl } from '../utils'

export async function searchModels<T extends Provider = Provider>(
  client: Client<T>,
  request?: Models.Request<T>,
): Promise<Models.Result> {

  // --- Extract the provider and options from the client.
  request ??= { provider: client.provider }
  const { id = randomUUID(), signal, options } = request
  const { models, name, baseUrl, parameters } = client.provider
  if (!models) throw new Error(`Provider "${name}" does not support searching models`)

  // --- Create the context object.
  const url = joinUrl(baseUrl, models.path)
  const init: RequestInit = {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }),
    signal,
  }

  const context: Models.Context = { id, request, provider: client.provider, url, init }
  applyParameters({ url, init, parameters, options: client.options })
  applyParameters({ url, init, parameters: models.parameters, options })
  if (models.onRequest) await models.onRequest(context)

  // --- Make the request and handle the response.
  try {
    client.dispatch('modelsRequest', id, context)
    client.dispatch('request', id, { url, init })
    context.response = await fetch(url, init)
    client.dispatch('response', id, context.response)
    client.dispatch('modelsResponse', id, context)
    const result = await models.onResponse(context)
    client.dispatch('modelsResult', id, result)
    return result
  }
  catch (error) {
    client.dispatch('modelsError', id, error as Error)
    throw error
  }
}
