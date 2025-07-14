import type { Transcript } from '../../transcript'

export function onRequestTranscript(context: Transcript.Context): void {
  const { request, init } = context

  // --- Create FormData for multipart/form-data request
  const formData = new FormData()

  // --- Handle the audio file input
  if (request.file instanceof File) {
    formData.append('file', request.file)
  }
  else if (request.file instanceof Uint8Array) {
    const blob = new Blob([request.file], { type: 'audio/wav' })
    formData.append('file', blob, 'audio.wav')
  }
  else if (typeof request.file === 'string') {
    // Assume base64 encoded audio
    const binaryString = atob(request.file)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++)
      bytes[i] = binaryString.codePointAt(i) ?? 0

    const blob = new Blob([bytes], { type: 'audio/wav' })
    formData.append('file', blob, 'audio.wav')
  }

  // --- Add required model parameter
  formData.append('model', request.model)

  // --- Add optional parameters from options
  const { options } = request
  if (options?.language && typeof options.language === 'string')
    formData.append('language', options.language)
  if (options?.prompt && typeof options.prompt === 'string')
    formData.append('prompt', options.prompt)
  if (options?.responseFormat && typeof options.responseFormat === 'string')
    formData.append('response_format', options.responseFormat)
  if (options?.temperature !== undefined && typeof options.temperature === 'number')
    formData.append('temperature', String(options.temperature))
  if (options?.timestampGranularities) {
    const granularities = Array.isArray(options.timestampGranularities)
      ? options.timestampGranularities
      : [options.timestampGranularities]
    for (const g of granularities)
      formData.append('timestamp_granularities[]', String(g))
  }

  // --- Set the request body (don't set Content-Type, let browser set it with boundary)
  init.body = formData
}
