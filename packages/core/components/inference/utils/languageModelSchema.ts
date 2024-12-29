import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { Thread } from '../../../thread'
import type { InferSchema, Schema, SchemaType } from '../../../utils'
import type { Tool } from '../../../utils/toolSchema'
import type { LanguageModelMessage } from './languageModelMessageSchema'
import type { LanguageModelParameters } from './languageModelParametersSchema'

export interface LanguageModelRequestContext {
  nodeId: string
  thread: Thread
  url: string
  method: string
  body: ObjectLike
  headers: Headers
  model: string
  tools: Tool[]
  parameters: LanguageModelParameters
  messages: LanguageModelMessage[]
}

export interface LanguageModelResponseContext {
  response: Response
  resume: () => void
  pushContent: (content: ReadableStream<string> | string | string[]) => Promise<void>
  pushMessages: (...messages: LanguageModelMessage[]) => Promise<void>
  pushMessageDelta: (message: LanguageModelMessage) => void
}

export type LanguageModel = InferSchema<typeof languageModelSchema>

export const languageModelSchema = {
  type: 'object',
  required: [
    'url',
    'model',
    'onRequest',
    'onResponse',
  ],
  properties: {
    url: { type: 'string' },
    model: { type: 'string' },
    onRequest: { 'x-type': 'function' } as unknown as SchemaType<(context: LanguageModelRequestContext, token?: string) => MaybePromise<void>>,
    onResponse: { 'x-type': 'function' } as unknown as SchemaType<(context: LanguageModelResponseContext) => MaybePromise<void>>,
  },
} as const satisfies Schema
