import type { LanguageModelResponseContext } from '../../inference'
import { anthropicOnResponseError } from './anthropicOnResponseError'
import { anthropicOnResponseJson } from './anthropicOnResponseJson'
import { anthropicOnResponseStream } from './anthropicOnResponseStream'

export async function anthropicOnResponse(context: LanguageModelResponseContext): Promise<void> {
  if (!context.response.ok) await anthropicOnResponseError(context.response)
  const contentType = context.response.headers.get('content-type')
  if (!contentType) throw new Error('Expected the "Content-Type" header to be set.')
  if (contentType.startsWith('application/json')) return anthropicOnResponseJson(context)
  if (contentType.startsWith('text/event-stream')) return anthropicOnResponseStream(context)
}
