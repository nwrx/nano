import type { MaybePromise } from '@unshared/types'
import type { Schema } from 'jsonschema'
import type { Client } from '../createClient'
import type { Provider, ProviderFeatureOptions } from '../utils'

export namespace Chat {
  export interface QueueText {
    type: 'text'
    deltas: string[]
  }

  export interface QueueTool {
    type: 'tool'
    toolCallId: string
    toolName: string
    providerExecuted?: boolean
    deltas: string[]
  }

  export type Queue =
    | QueueText
    | QueueTool

  export interface Tool {
    name: string
    description?: string
    inputSchema?: Schema
    call: (input: Record<string, unknown>) => MaybePromise<unknown>
  }

  export interface Request<T extends Provider = Provider> {
    id?: string
    model: string
    tools?: Tool[]
    messages: MessageLike[]
    options?: ProviderFeatureOptions<T, 'chat'>
    signal?: AbortSignal
  }

  export interface Context {
    id: string
    provider: Provider
    request: Request
    messages: Message[]
    isDone?: boolean
    url: URL
    init: RequestInit
    response?: Response
    pendingMessages: Map<string, Queue>
    pendingToolCalls: ContentToolCall[]
    resume: () => void
    pushEvent: (event: Event) => void
    controller: ReadableStreamDefaultController<string>
  }

  export type FinishReason =
    | 'content-filter' // content filter violation stopped the model
    | 'error' // model stopped because of an error
    | 'length' // model generated maximum number of tokens
    | 'other' // model stopped for other reasons
    | 'stop' // model generated stop sequence
    | 'tool-calls' // model triggered tool calls
    | 'unknown' // the model has not transmitted a finish reason

  /**************************************/
  /* Models                             */
  /**************************************/

  export type ModelFeature =
    | 'AcceptDocument' // Process documents (e.g., PDFs, Word files)
    | 'AcceptImageData' // Process images as data (e.g., base64 encoded)
    | 'AcceptImageUrl' // Process images as URLs
    | 'Reasoning' // Perform reasoning tasks before generating output
    | 'SpeechToText' // Convert spoken language into text
    | 'StructuredOutput' // Generate structured outputs like JSON
    | 'ToolUse' // Use tools to perform actions based on model output

  /**************************************/
  /* Messages                           */
  /**************************************/

  export type Message =
    | MessageAssistant
    | MessageSystem
    | MessageTool
    | MessageUser

  export type MessageAssistantContent =
    | ContentFile
    | ContentReasoning
    | ContentText
    | ContentToolCall
    | ContentToolResult

  export type MessageUserContent =
    | ContentFile
    | ContentText

  export interface MessageAssistant {
    role: 'assistant'
    content: MessageAssistantContent[]
  }

  export interface MessageSystem {
    role: 'system'
    content: string
  }

  export interface MessageTool {
    role: 'tool'
    content: ContentToolResult[]
  }

  export interface MessageUser {
    role: 'user'
    content: MessageUserContent[]
  }

  /**************************************/
  /* Shorthands                         */
  /**************************************/

  /** Any kind of value that can be transformed into a message. */
  export type MessageLike =
    | Message
    | MessageContentUserLike
    | MessageContentUserLike[]

  /** Any kind of value that can be transformed into a user message content. */
  export type MessageContentUserLike =
    | boolean
    | File
    | number
    | ReadableStream<string | Uint8Array>
    | string

  /**************************************/
  /* Content                            */
  /**************************************/

  export type Content =
    | ContentFile
    | ContentReasoning
    | ContentText
    | ContentToolCall
    | ContentToolResult

  export interface ContentText {
    type: 'text'
    text: string
  }

  export interface ContentReasoning {
    type: 'reasoning'
    text: string
  }

  export interface ContentFile {
    type: 'file'
    name?: string
    data: string | Uint8Array | URL
    mediaType: string
  }

  export interface ContentToolCall {
    type: 'tool-call'
    toolCallId: string
    toolName: string
    input: unknown
    providerExecuted?: boolean
  }

  export interface ContentToolResult {
    type: 'tool-result'
    toolCallId: string
    toolName: string
    output: Array<
      | ToolOutputContent
      | ToolOutputErrorJson
      | ToolOutputErrorText
      | ToolOutputJson
      | ToolOutputText
    >
  }

  /**************************************/
  /* Tool Outputs                       */
  /**************************************/

  interface ToolOutputContent {
    type: 'content'
    value: Array<
      | { type: 'media'; data: string; mediaType: string }
      | { type: 'text'; text: string }
    >
  }

  interface ToolOutputErrorJson {
    type: 'error-json'
    value: Record<string, unknown>
  }

  interface ToolOutputErrorText {
    type: 'error-text'
    value: string
  }

  interface ToolOutputJson {
    type: 'json'
    value: Record<string, unknown>
  }

  interface ToolOutputText {
    type: 'text'
    value: string
  }

  /**************************************/
  /* Streaming                          */
  /**************************************/

  export interface Usage {
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
    reasoningTokens?: number
    cachedInputTokens?: number
  }

  export interface ResponseMetadata {
    id?: string
    timestamp?: Date
    modelId?: string
  }

  export type Event =
    | ContentFile
    | ContentToolCall
    | ContentToolResult
    | EventError
    | EventFinish
    | EventRaw
    | EventReasoningDelta
    | EventReasoningEnd
    | EventReasoningStart
    | EventResponseMetadata
    | EventStreamStart
    | EventTextDelta
    | EventTextEnd
    | EventTextStart
    | EventToolInputDelta
    | EventToolInputEnd
    | EventToolInputStart
    | EventUsage
    // | LanguageModelV2Source

  export interface EventResponseMetadata extends ResponseMetadata {
    type: 'response-metadata'
  }

  export interface EventToolInputStart {
    type: 'tool-input-start'
    id: string
    toolName: string
    toolCallId?: string
    providerExecuted?: boolean
  }

  export interface EventToolInputDelta {
    type: 'tool-input-delta'
    id: string
    delta: string
  }

  export interface EventToolInputEnd {
    type: 'tool-input-end'
    id: string
  }

  export interface EventTextStart {
    type: 'text-start'
    id: string
  }

  export interface EventTextDelta {
    type: 'text-delta'
    id: string
    delta: string
  }

  export interface EventTextEnd {
    type: 'text-end'
    id: string
  }

  export interface EventReasoningStart {
    type: 'reasoning-start'
    id: string
  }

  export interface EventReasoningDelta {
    type: 'reasoning-delta'
    id: string
    delta: string
  }

  export interface EventReasoningEnd {
    type: 'reasoning-end'
    id: string
  }

  export interface EventFinish {
    type: 'finish'
    finishReason: FinishReason
  }

  export interface EventUsage {
    type: 'usage'
    usage: Usage
  }

  export interface EventRaw {
    type: 'raw'
    rawValue: unknown
  }

  export interface EventError {
    type: 'error'
    error: unknown
  }

  export interface EventStreamStart {
    type: 'stream-start'
    timestamp: Date
  }
}
