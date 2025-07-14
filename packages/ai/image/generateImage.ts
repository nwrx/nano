import type { Client } from '../createClient'
import type { Provider } from '../utils'
import type { Image } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters, joinUrl } from '../utils'

export async function generateImage<T extends Provider = Provider>(
  client: Client<T>,
  request: Image.Request<T>,
): Promise<Image.Result[]> {

  // --- Extract the provider and options from the client.
  const { id = randomUUID(), signal, options } = request
  const { image, name, baseUrl, parameters } = client.provider
  if (!image) throw new Error(`Provider "${name}" does not support text-to-speech generation`)

  // --- Create the context object.
  const url = joinUrl(baseUrl, image.path)
  const init: RequestInit = { method: 'POST', signal }
  const context: Image.Context = { id, request, provider: client.provider, url, init }
  if (image.onRequest) await image.onRequest(context)
  applyParameters({ url, init, parameters, options: client.options })
  applyParameters({ url, init, parameters: image.parameters, options })

  // --- Make the request and handle the response.
  try {
    client.dispatch('imageRequest', id, context)
    client.dispatch('request', id, { url, init })
    context.response = await fetch(url, init)
    client.dispatch('response', id, context.response)
    client.dispatch('imageResponse', id, context)
    const results = await image.onResponse(context)
    client.dispatch('imageResult', id, results)
    return results
  }
  catch (error) {
    client.dispatch('embeddingsError', id, error as Error)
    throw error
  }
}
