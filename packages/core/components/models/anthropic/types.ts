export namespace Anthropic {
  export interface Model {
    type: 'model'
    id: string
    display_name: string
    created_at: string
  }

  export interface ModelResponse {
    data: Model[]
    has_more: boolean
    first_id: string
    last_id: string
  }

  /**************************************************************/
  /* Error                                                      */
  /**************************************************************/

  export interface ErrorResponse {
    type: 'error'
    error: {
      type: 'invalid_request_error'
      message: string
    }
  }

  /**************************************************************/
  /* Message                                                    */
  /**************************************************************/

  export interface Message {
    role: 'assistant' | 'user'
    content: MessageContent[] | string
  }

  export type MessageContent =
    | MessageContentDocument
    | MessageContentImage
    | MessageContentText
    | MessageContentToolResult
    | MessageContentToolUse

  export interface MessageContentDocument {
    type: 'image'
    source: MessageDocumentSource
    cache_control?: { type: 'ephemeral' }
  }

  export interface MessageDocumentSource {
    type: 'base64'
    media_type: 'application/pdf'
    data: string
  }

  export interface MessageContentImage {
    type: 'image'
    source: MessageImageSource
    cache_control?: { type: 'ephemeral' }
  }

  export interface MessageImageSource {
    type: 'base64'
    media_type: 'image/gif' | 'image/jpeg' | 'image/png' | 'image/webp'
    data: string
  }

  export interface MessageContentText {
    type: 'text'
    text: string
    cache_control?: { type: 'ephemeral' }
  }

  export interface MessageContentToolUse {
    type: 'tool_use'
    id: string
    name: string
    input: Record<string, unknown>
    cache_control?: { type: 'ephemeral' }
  }

  export interface MessageContentToolResult {
    type: 'tool_result'
    tool_use_id: string
    is_error: boolean
    content: string
    cache_control?: { type: 'ephemeral' }
  }

  /**************************************************************/
  /* Request                                                    */
  /**************************************************************/

  export interface RequestBody {
    model: string
    messages: Message[]
    max_tokens?: number
    metadata?: Record<string, unknown>
    stop_sequences?: string[]
    stream?: boolean
    system?: MessageSystem[] | string
    temperature?: number
    tool_choice?: ToolChoice
    tools?: Tool[]
    top_k?: number
    top_p?: number
  }

  export interface MessageSystem {
    type: 'text'
    text: string
    cache_control: { type: 'ephemeral' }
  }

  export interface Tool {
    name: string
    description?: string
    input_schema: Record<string, unknown>
    cache_control?: { type: 'ephemeral' }
  }

  export type ToolChoice =
    | { type: 'any' }
    | { type: 'auto' }
    | { type: 'tool'; name: string }

  /**************************************************************/
  /* Response                                                   */
  /**************************************************************/

  export interface ResponseBody {
    id: string
    type: 'message'
    role: 'assistant'
    content: Array<MessageContentText | MessageContentToolUse>
    model: string
    stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use'
    stop_sequence?: string
    usage: ResponseUsage
  }

  export interface ResponseUsage {
    input_tokens: number
    cache_creation_input_tokens: number
    cache_read_input_tokens: number
    output_tokens: number
  }

  export type Chunk =
    | ChunkContentBlockDelta
    | ChunkContentBlockStart
    | ChunkContentBlockStop
    | ChunkMessageDelta
    | ChunkMessageStart
    | ChunkMessageStop
    | ChunkPing

  export interface ChunkMessageStart {
    type: 'message_start'
    message: ResponseBody
  }

  export interface ChunkContentBlockStart {
    type: 'content_block_start'
    index: number
    content_block: MessageContentText | MessageContentToolUse
  }

  export interface ChunkContentBlockDelta {
    type: 'content_block_delta'
    index: number
    delta:
      | { type: 'input_json_delta'; partial_json: string }
      | { type: 'text_delta'; text: string }
  }

  export interface ChunkContentBlockStop {
    type: 'content_block_stop'
    index: number
  }

  export interface ChunkMessageDelta {
    type: 'message_delta'
    usage: ResponseUsage
    delta:
      | { stop_reason: 'end_turn'; stop_sequence: null | string }
      | { stop_reason: 'tool_use'; stop_sequence: null | string }
  }

  export interface ChunkMessageStop {
    type: 'message_stop'
  }

  export interface ChunkPing {
    type: 'ping'
  }
}
