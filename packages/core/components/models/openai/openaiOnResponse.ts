import type { LanguageModelResponseContext } from '../../inference'
import { OPENAI_ERRORS as E } from './errors'
import { openaiOnResponseError } from './openaiOnResponseError'
import { openaiOnResponseJson } from './openaiOnResponseJson'
import { openaiOnResponseStream } from './openaiOnResponseStream'

export async function openaiOnResponse(context: LanguageModelResponseContext): Promise<void> {
  if (!context.response.ok) await openaiOnResponseError(context.response)
  const contentType = context.response.headers.get('content-type')
  if (!contentType) throw E.RESPONSE_MISSING_CONTENT_TYPE()
  if (contentType.startsWith('application/json')) return openaiOnResponseJson(context)
  if (contentType.startsWith('text/event-stream')) return openaiOnResponseStream(context)
}
