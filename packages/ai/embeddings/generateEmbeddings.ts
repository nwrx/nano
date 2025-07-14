import type { Client } from '../createClient'
import type { Provider } from '../utils'
import type { Embeddings } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters, joinUrl } from '../utils'

export async function generateEmbeddings<T extends Provider = Provider>(
  client: Client<T>,
  request: Embeddings.Request<T>,
): Promise<Embeddings.Result> {

  // --- Extract the provider and options from the client.
  const { id = randomUUID(), signal, options } = request
  const { embeddings, name, baseUrl, parameters } = client.provider
  if (!embeddings) throw new Error(`Provider "${name}" does not support text-to-speech generation`)

  // --- Create the context object.
  const url = joinUrl(baseUrl, embeddings.path)
  const init: RequestInit = { method: 'POST', signal }
  const context: Embeddings.Context = { id, request, provider: client.provider, url, init }
  if (embeddings.onRequest) await embeddings.onRequest(context)
  applyParameters({ url, init, parameters, options: client.options })
  applyParameters({ url, init, parameters: embeddings.parameters, options })

  // --- Make the request and handle the response.
  try {
    client.dispatch('embeddingsRequest', id, context)
    client.dispatch('request', id, { url, init })
    context.response = await fetch(url, init)
    client.dispatch('response', id, context.response)
    client.dispatch('embeddingsResponse', id, context)
    const result = await embeddings.onResponse(context)
    client.dispatch('embeddingsResult', id, result)
    return result
  }
  catch (error) {
    client.dispatch('embeddingsError', id, error as Error)
    throw error
  }
}
