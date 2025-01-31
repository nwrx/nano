export namespace OpenAI {

  /**************************************************************/
  /* Model                                                      */
  /**************************************************************/

  export interface ModelResponse {
    object: 'list'
    data: Model[]
  }

  export interface Model {
    id: string
    created: number
    owned_by: string
    object: 'model'
  }

  /**************************************************************/
  /* Error                                                      */
  /**************************************************************/

  export interface ErrorResponse {
    error: {
      code: string
      message: string
    }
  }

  /**************************************************************/
  /* Message                                                    */
  /**************************************************************/

  export type Message =
    | MessageAssistant
    | MessageSystem
    | MessageTool
    | MessageUser

  export interface MessageSystem {
    role: 'system'
    content: string | string[]
    name?: string
  }

  export interface MessageUser {
    role: 'user'
    content: string | string[]
    name?: string
  }

  export interface MessageAssistant {
    role: 'assistant'
    content?: string | string[]
    refusal?: string
    name?: string
    audio?: AudioData
    tool_calls?: ToolCall[]
  }

  export interface MessageTool {
    role: 'tool'
    content?: string | string[]
    tool_call_id: string
  }

  export interface AudioData {
    id: string
    expires_at: number
    data: string
    transcript: string
  }

  export interface ToolCall {
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }

  /**************************************************************/
  /* Request                                                    */
  /**************************************************************/

  export interface RequestBody {
    messages: Message[]
    model: string
    store?: boolean
    metadata?: Record<string, any>
    frequency_penalty?: number
    logit_bias?: Record<string, number>
    logprobs?: boolean
    top_logprobs?: number
    max_completion_tokens?: number
    n?: number
    modalities?: Array<'audio' | 'text'>
    audio?: AudioParameters
    presence_penalty?: number
    response_format?: ResponseFormat
    seed?: number
    service_tier?: 'auto' | 'default'
    stop?: string | string[]
    stream?: boolean
    stream_options?: StreamOptions
    temperature?: number
    top_p?: number
    tools?: Tool[]
    tool_choice?: 'auto' | 'none' | 'required' | ToolChoiceFunction
    parallel_tool_calls?: boolean
    user?: string
  }

  export interface Tool {
    type: 'function'
    function: ToolFunction
  }

  export interface ToolFunction {
    name: string
    description?: string
    parameters?: Record<string, unknown>
    strict?: boolean
  }

  export interface AudioParameters {
    voice: 'alloy' | 'echo' | 'fable' | 'nova' | 'onyx' | 'shimmer'
    format: 'flac' | 'mp3' | 'opus' | 'pcm16' | 'wav'
  }

  type ResponseFormat =
    | { type: 'json_object' }
    | { type: 'json_schema'; json_schema: JsonSchema }
    | { type: 'text' }

  export interface JsonSchema {
    description?: string
    name: string
    schema?: Record<string, any>
    strict?: boolean
  }

  export interface StreamOptions {
    include_usage?: boolean
  }

  export interface ToolChoiceFunction {
    type: 'function'
    function: { name: string }
  }

  /**************************************************************/
  /* Response                                                   */
  /**************************************************************/

  export interface ResponseBody {
    id: string
    object: 'chat.completion'
    created: number
    model: string
    choices: Choice[]
    usage: Usage
    service_tier?: string
    system_fingerprint: string
  }

  export interface Choice {
    index: number
    message: MessageAssistant
    finish_reason: 'content_filter' | 'function_call' | 'length' | 'stop' | 'tool_calls'
    logprobs?: LogProbs | null
  }

  export interface LogProbs {
    content?: null | TokenLogProbs[]
    refusal?: null | TokenLogProbs[]
  }

  export interface TokenLogProbs {
    token: string
    logprob: number
    bytes?: number[]
    top_logprobs?: null | TopLogProb[]
  }

  export interface TopLogProb {
    token: string
    logprob: number
    bytes?: number[]
  }

  export interface Usage {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
    completion_tokens_details?: CompletionTokensDetails
    prompt_tokens_details?: PromptTokensDetails
  }

  export interface CompletionTokensDetails {
    audio_tokens?: number
    reasoning_tokens?: number
  }

  export interface PromptTokensDetails {
    audio_tokens?: number
    cached_tokens?: number
  }

  /**************************************************************/
  /* Stream                                                     */
  /**************************************************************/

  export interface StreamPayload {
    id: string
    object: 'chat.completion.chunk'
    created: number
    model: string
    choices: StreamPayloadChoice[]
    usage: Usage
    service_tier?: string
    system_fingerprint: string
  }

  export interface StreamPayloadChoice {
    index: number
    delta: MessageAssistant & { tool_calls?: Array<ToolCall & { index: number }> }
    finish_reason: 'content_filter' | 'function_call' | 'length' | 'stop' | 'tool_calls'
    logprobs?: LogProbs | null
  }
}
