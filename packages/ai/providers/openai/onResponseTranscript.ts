import type { Transcript } from '../../transcript'
import { } from 'openai/resources'
import { onResponseError } from './onResponseError'

export async function onResponseTranscript(context: Transcript.Context): Promise<Transcript.Result[]> {
  const { response, provider } = context
  if (!response) throw new Error('No response available')
  if (!response.ok) return onResponseError({ response, provider })

  // --- Parse the JSON response
  const stream = response.body
  if (!stream) throw new Error('Response body is not available')
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8')

  // DEBUG: log each chunk of the stream
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    console.log('Chunk:', chunk)
  }
}
