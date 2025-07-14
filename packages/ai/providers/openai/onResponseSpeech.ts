import type { Speech } from '../../speech'
import { onResponseError } from './onResponseError'
import { onResponseSpeechAudio } from './onResponseSpeechAudio'
import { onResponseSpeechSse } from './onResponseSpeechSse'

export async function onResponseSpeech(context: Speech.Context): Promise<Speech.Result[]> {
  const { response, provider } = context

  // --- Assert the response is set and valid.
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  if (!response.ok) await onResponseError({ response, provider })

  const contentType = response.headers.get('content-type')
  if (!contentType) throw new Error('No content type found in response headers.')
  if (contentType.startsWith('text/event-stream')) return onResponseSpeechSse(context)
  if (contentType.startsWith('audio/')) return onResponseSpeechAudio(context)
  throw new Error(`Unsupported content type: ${contentType}. Expected "text/event-stream" or "audio/*".`)
}
