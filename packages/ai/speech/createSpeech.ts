import type { Client } from '../createClient'
import type { Provider } from '../utils'
import type { Speech } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters, joinUrl } from '../utils'

export async function createSpeech<T extends Provider>(
  client: Client<T>,
  request: Speech.Request<T>,
): Promise<Speech.Result[]> {

  // --- Extract the provider and options from the client.
  const { id = randomUUID(), signal, options } = request
  const { speech, name, baseUrl, parameters } = client.provider
  if (!speech) throw new Error(`Provider "${name}" does not support text-to-speech generation`)

  // --- Create and build the context object.
  const url = joinUrl(baseUrl, speech.path)
  const init: RequestInit = { method: 'POST', signal, headers: new Headers({ 'Content-Type': 'application/json' }) }
  const context: Speech.Context = { id, request, provider: client.provider, url, init }
  if (speech.onRequest) await speech.onRequest(context)
  applyParameters({ url, init, parameters, options: client.options })
  applyParameters({ url, init, parameters: speech.parameters, options })

  // --- Make the request and handle the response.
  try {
    client.dispatch('speechRequest', id, context)
    client.dispatch('request', id, { url, init })
    context.response = await fetch(url, init)
    client.dispatch('response', id, context.response)
    client.dispatch('speechResponse', id, context)
    const results = await speech.onResponse(context)
    client.dispatch('speechResult', id, results)
    return results
  }
  catch (error) {
    client.dispatch('speechError', id, error as Error)
    throw error
  }
}
