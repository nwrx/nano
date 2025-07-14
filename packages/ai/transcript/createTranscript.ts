import type { Client } from '../createClient'
import type { Provider } from '../utils'
import type { Transcript } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters } from '../utils'

export async function createTranscript<T extends Provider = Provider>(
  client: Client<T>,
  request: Transcript.Request<T>,
): Promise<Transcript.Result[]> {

  // --- Extract the provider and options from the client.
  const { id = randomUUID(), abortSignal, options } = request
  const { transcript, baseUrl, name, parameters } = client.provider
  if (!transcript) throw new Error(`Provider "${name}" does not support speech-to-text generation`)

  // --- Create and build the context object.
  const url = new URL(transcript.path, baseUrl)
  const init: RequestInit = { method: 'POST', signal: abortSignal }
  const context: Transcript.Context = { id, request, provider: client.provider, url, init }
  if (transcript.onRequest) await transcript.onRequest(context)
  applyParameters({ url, init, parameters, options: client.options })
  applyParameters({ url, init, parameters: transcript.parameters, options })

  // --- Make the request and handle the response.
  try {
    client.dispatch('transcriptRequest', id, context)
    client.dispatch('request', id, { url, init })
    context.response = await fetch(url, init)
    client.dispatch('response', id, context.response)
    client.dispatch('transcriptResponse', id, context)
    const results = await transcript.onResponse(context)
    client.dispatch('transcriptResult', id, results)
    return results
  }
  catch (error) {
    client.dispatch('transcriptError', id, error as Error)
    throw error
  }
}
