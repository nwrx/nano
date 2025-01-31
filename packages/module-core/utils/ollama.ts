import type { JSONSchema4 } from 'json-schema'

export interface OllamaModelDetails {
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}

export interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
  details: OllamaModelDetails
}

/**************************************************************/
/* Message                                                    */
/**************************************************************/

export interface OllamaChatMessage {
  role: 'assistant' | 'system' | 'tool' | 'user'
  content: string
  images?: string[]
  tool_calls?: ToolCall[]
}

interface ToolCall {
  function: {
    name: string
    arguments: Record<string, any>
  }
}

/**************************************************************/
/* Request                                                    */
/**************************************************************/

export interface OllamaChatRequest {
  model: string
  messages: OllamaChatMessage[]
  tools?: RequestTool[]
  format?: string
  options?: RequestOptions
  stream?: boolean
  keep_alive?: string
}

interface RequestTool {
  type: string
  function: {
    name: string
    description: string
    parameters: JSONSchema4
  }
}

interface RequestOptions {
  temperature?: number
  top_p?: number
  max_tokens?: number
  n?: number
  seed?: number
}

/**************************************************************/
/* Response                                                   */
/**************************************************************/

export interface OllamaChatResponse {
  model: string
  created_at: string
  message: OllamaChatMessage
  done_reason: string
  done: boolean
  total_duration: number
  load_duration: number
  prompt_eval_count: number
  prompt_eval_duration: number
  eval_count: number
  eval_duration: number
}
