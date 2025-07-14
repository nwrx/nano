import type { ChatCompletion } from 'openai/resources'
import type { Chat } from '../../chat'

/**
 * Converts the OpenAI finish reason to a standardized {@linkcode Chat.FinishReason}.
 *
 * @param finishReason The OpenAI finish reason.
 * @returns The standardized {@linkcode Chat.FinishReason}.
 */
export function toFinishReason(finishReason?: ChatCompletion.Choice['finish_reason'] | null): Chat.FinishReason {
  if (finishReason === 'stop') return 'stop'
  else if (finishReason === 'length') return 'length'
  else if (finishReason === 'tool_calls') return 'tool-calls'
  else if (finishReason === 'function_call') return 'tool-calls'
  else if (finishReason === 'content_filter') return 'content-filter'
  return 'unknown'
}
