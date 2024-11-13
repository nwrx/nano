import type { JSONSchema4 } from 'json-schema'

export interface OpenaiModelResponse {
  object: 'list'
  data: OpenaiModelObject[]
}

export interface OpenaiModelObject {
  id: string
  created: number
  owned_by: string
  object: 'model'
}

/**************************************************************/
/* Message                                                    */
/**************************************************************/

export type OpenaiChatMessage =
  | MessageAssistant
  | MessageSystem
  | MessageTool
  | MessageUser

interface MessageSystem {
  role: 'system'
  content: string | string[]
  name?: string
}

interface MessageUser {
  role: 'user'
  content: string | string[]
  name?: string
}

interface MessageAssistant {
  role: 'assistant'
  content?: string | string[]
  refusal?: string
  name?: string
  audio?: AudioData
  tool_calls?: ToolCall[]
}

interface MessageTool {
  role: 'tool'
  content?: string | string[]
  tool_call_id: string
}

interface AudioData {
  id: string
  expires_at: number
  data: string
  transcript: string
}

interface ToolCall {
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

export interface OpenaiChatRequest {
  messages: OpenaiChatMessage[]
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

interface AudioParameters {
  voice: 'alloy' | 'echo' | 'fable' | 'nova' | 'onyx' | 'shimmer'
  format: 'flac' | 'mp3' | 'opus' | 'pcm16' | 'wav'
}

type ResponseFormat =
  | { type: 'json_object' }
  | { type: 'json_schema'; json_schema: JsonSchema }
  | { type: 'text' }

interface JsonSchema {
  description?: string
  name: string
  schema?: object
  strict?: boolean
}

interface StreamOptions {
  include_usage?: boolean
}

interface Tool {
  type: 'function'
  function: ToolFunctionDefinition
}

interface ToolFunctionDefinition {
  name: string
  description?: string
  parameters?: JSONSchema4
  strict?: boolean
}

interface ToolChoiceFunction {
  type: 'function'
  function: { name: string }

/**************************************************************/
/* Response                                                   */
/**************************************************************/

}export interface OpenaiChatResponse {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: Choice[]
  usage: Usage
  service_tier?: string
  system_fingerprint: string
}

interface Choice {
  index: number
  message: OpenaiChatMessage
  finish_reason: 'content_filter' | 'function_call' | 'length' | 'stop' | 'tool_calls'
  logprobs?: LogProbs | null
}

interface LogProbs {
  content?: TokenLogProbs[] | null
  refusal?: TokenLogProbs[] | null
}

interface TokenLogProbs {
  token: string
  logprob: number
  bytes?: number[]
  top_logprobs?: TopLogProb[] | null
}

interface TopLogProb {
  token: string
  logprob: number
  bytes?: number[]
}

interface Usage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
  completion_tokens_details?: CompletionTokensDetails
  prompt_tokens_details?: PromptTokensDetails
}

interface CompletionTokensDetails {
  audio_tokens?: number
  reasoning_tokens?: number
}

interface PromptTokensDetails {
  audio_tokens?: number
  cached_tokens?: number
}
