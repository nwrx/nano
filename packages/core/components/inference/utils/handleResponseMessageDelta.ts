import type { LanguageModelMessage } from './languageModelMessageSchema'
import type { LanguageModelRequestContext } from './languageModelSchema'
import { INFERENCE_ERRORS as E } from './errors'

export interface EventMessageDeltaEnd {
  id: string
  end: string
}

export interface EventMessageDelta {
  id: string
  delta: string
}

export interface EventMessageDeltaStart {
  id: string
  start: string
}

export function handleResponseMessageDelta(context: LanguageModelRequestContext, message: LanguageModelMessage): void {
  const lastMessage = context.messages.at(-1)
  if (!lastMessage)
    throw E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE()
  if (lastMessage.role !== 'assistant')
    throw E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_LAST_MESSAGE_NOT_ASSISTANT()
  if (message.role !== 'assistant')
    throw E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MESSAGE_NOT_ASSISTANT()
  if (typeof lastMessage.content !== 'string')
    throw E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE_CONTENT()
  if (typeof message.content !== 'string')
    throw E.INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_MESSAGE_CONTENT()
  lastMessage.content += message.content
}
