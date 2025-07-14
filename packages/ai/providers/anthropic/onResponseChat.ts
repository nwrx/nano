import type { Chat } from '../../chat'
import { onResponseChatJson } from './onResponseChatJson'
import { onResponseChatStream } from './onResponseChatStream'
import { onResponseError } from './onResponseError'

export async function onResponseChat(context: Chat.Context): Promise<void> {
  const { response } = context

  // --- Assert the response is set and valid.
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  if (!response.ok) await onResponseError(context)

  // --- Extract the response content type and handle accordingly.
  const contentType = response.headers.get('content-type')
  if (!contentType) throw new Error('Expected the "Content-Type" header to be set.')
  if (contentType.startsWith('application/json')) return onResponseChatJson(context)
  if (contentType.startsWith('text/event-stream')) return onResponseChatStream(context)
  throw new Error(`Unsupported content type: ${contentType}`)
}
