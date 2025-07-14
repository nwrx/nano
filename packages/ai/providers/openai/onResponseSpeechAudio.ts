import type { Speech } from '../../speech'
import { onResponseError } from './onResponseError'

export async function onResponseSpeechAudio(context: Speech.Context): Promise<Speech.Result[]> {
  const { response, provider } = context
  if (!response) throw new Error('No response available')
  if (!response.ok) return onResponseError({ response, provider })
  if (!response.body) throw new Error('No response body found for streaming request.')

  // --- Assert the response content type is audio/*
  const contentType = response.headers.get('content-type')
  if (!contentType) throw new Error('No content type found in response headers.')
  if (!contentType.startsWith('audio/')) throw new Error(`Expected "audio/*" content type, got "${contentType}".`)

  // --- Extract the stream and media type.
  const stream = response.body
  const mediaType = contentType.split(';')[0] // Extract the media type without parameters

  const headers = response.headers
  console.log('Response Headers:', [...headers.entries()])

  return [{
    getStream() {
      return stream
    },
    getMediaType() {
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
      return `data:${mediaType};base64,${base64}`
    },
    async getFile() {
      const buffer = await this.getBuffer()
      return new File([buffer], 'speech.mp3', { type: mediaType })
    },
    getUsage: () => Promise.resolve({}),
  }]
}
