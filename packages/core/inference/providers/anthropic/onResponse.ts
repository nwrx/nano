import type { TextGeneration } from '../../textGeneration'
import { onResponseError } from './onResponseError'
import { onResponseJson } from './onResponseJson'
import { onResponseStream } from './onResponseStream'

export async function onResponse(context: TextGeneration.Context): Promise<void> {
  const { response } = context

  // --- Assert the response is set and valid.
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  if (!response.ok) await onResponseError(context)

  // --- Extract the response content type and handle accordingly.
  const contentType = response.headers.get('content-type')
  if (!contentType) throw new Error('Expected the "Content-Type" header to be set.')
  if (contentType.startsWith('application/json')) return onResponseJson(context)
  if (contentType.startsWith('text/event-stream')) return onResponseStream(context)
  throw new Error(`Unsupported content type: ${contentType}`)
}
