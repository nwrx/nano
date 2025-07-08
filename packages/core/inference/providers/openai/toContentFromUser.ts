import type { ChatCompletionContentPart, ChatCompletionContentPartInputAudio } from 'openai/resources'
import type { TextGeneration } from '../../textGeneration'
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_MEDIA_TYPES } from './constants'

export function toContentFromUser(content: TextGeneration.MessageUserContent): ChatCompletionContentPart {
  if (content.type === 'text') {
    return { type: 'text', text: content.text }
  }
  else if (content.type === 'file') {
    if (ACCEPTED_AUDIO_TYPES.has(content.mediaType)) {
      if (content.data instanceof URL) throw new TypeError('Audio files cannot be URLs in OpenAI API')
      const data = typeof content.data === 'string' ? content.data : Buffer.from(content.data).toString('base64')
      const format = content.mediaType.split('/')[1] as ChatCompletionContentPartInputAudio.InputAudio['format']
      return { type: 'input_audio', input_audio: { data, format } }
    }
    else if (ACCEPTED_MEDIA_TYPES.has(content.mediaType)) {
      if (content.data instanceof URL) {
        return {
          type: 'image_url',
          image_url: { detail: 'auto', url: content.data.toString() },
        }
      }
      else {
        const base64 = typeof content.data === 'string' ? content.data : Buffer.from(content.data).toString('base64')
        return {
          type: 'image_url',
          image_url: {
            detail: 'auto',
            url: `data:${content.mediaType};base64,${base64}`,
          },
        }
      }
    }
    else {
      if (content.data instanceof URL)
        throw new TypeError(`File content cannot be a URL in OpenAI API: ${content.data.toString()}`)
      return {
        type: 'file',
        file: {
          file_data: typeof content.data === 'string' ? content.data : Buffer.from(content.data).toString('base64'),
          file_id: content.name ?? undefined,
          filename: content.name ?? undefined,
        },
      }
    }
  }
  throw new Error(`Invalid content type "${content.type}" for user message in OpenAI API.`)
}
