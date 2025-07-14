import type { SpeechCreateParams } from 'openai/resources/audio'
import type { Speech } from '../../speech'
import { createResolvable } from '@unshared/functions/createResolvable'
import { parseStreamEvents } from '../../utils'
import { onResponseError } from './onResponseError'

export interface SpeechEventDelta {
  type: 'speech.audio.delta'
  audio: string
}

export interface SpeechEventDone {
  type: 'speech.audio.done'
  usage: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

export type SpeechEvent = SpeechEventDelta | SpeechEventDone

export async function onResponseSpeechSse(context: Speech.Context): Promise<Speech.Result[]> {
  const { response, provider, init } = context
  if (!response) throw new Error('No response available')
  if (!response.ok) return onResponseError({ response, provider })
  if (!response.body) throw new Error('No response body found for streaming request.')
  const contentType = response.headers.get('content-type')
  if (!contentType) throw new Error('No content type found in response headers.')
  if (!contentType.startsWith('text/event-stream')) throw new Error(`Expected "text/event-stream" content type, got "${contentType}".`)

  console.log([...response.headers.entries()])
  // pushEvent({ type: 'stream-start', timestamp: new Date() })
  const usagePromise = createResolvable<Speech.Usage>()

  let chunkRemaining = ''
  const reader = response.body.getReader()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        if (!value) continue

        // Decode the value and append it to the chunk remaining
        chunkRemaining += new TextDecoder('utf8').decode(value)
        const { events, remaining } = parseStreamEvents<SpeechEvent>(chunkRemaining)
        chunkRemaining = remaining
        for (const event of events) {
          if (event.type === 'speech.audio.delta') {
            const audioChunk = Buffer.from(event.audio, 'base64')
            controller.enqueue(audioChunk)
          }
          else if (event.type === 'speech.audio.done') {
            controller.close()
            usagePromise.resolve({
              inputTokens: event.usage.input_tokens ?? 0,
              outputTokens: event.usage.output_tokens ?? 0,
              totalTokens: event.usage.total_tokens ?? 0,
            })
          }
        }
      }
    },
  })

  return [{
    getStream: () => stream,
    getMediaType() {
      const options = JSON.parse(init.body as string) as SpeechCreateParams
      const format = options.response_format
      const mediaType = format ? `audio/${format}` : 'application/octet-stream'
      return Promise.resolve(mediaType)
    },
    getBuffer: async() => {
      const chunks: Uint8Array[] = []
      const reader = stream.getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }
      return Buffer.concat(chunks)
    },
    async getBase64() {
      const buffer = await this.getBuffer()
      return buffer.toString('base64')
    },
    async getBase64Url() {
      const base64 = await this.getBase64()
      const mediaType = await this.getMediaType()
      return `data:${mediaType};base64,${base64}`
    },
    async getFile() {
      const buffer = await this.getBuffer()
      const type = await this.getMediaType()
      const extension = type.split('/')[1] || 'bin'
      return new File([buffer], `speech.${extension}`, { type })
    },
    getUsage: () =>
      usagePromise.promise,
  }]
}
