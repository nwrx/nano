import type { StopReason } from '@anthropic-ai/sdk/resources'
import type { Chat } from '../../chat'

/**
 * Maps the stop reason from the Anthropic API to a finish reason for the chat response.
 *
 * @param stopReason The stop reason from the Anthropic API response.
 * @returns The corresponding finish reason for the chat response.
 */
export function toFinishReason(stopReason: null | StopReason): Chat.FinishReason {
  if (stopReason === 'end_turn') return 'stop'
  if (stopReason === 'stop_sequence') return 'stop'
  if (stopReason === 'pause_turn') return 'stop'
  if (stopReason === 'max_tokens') return 'length'
  if (stopReason === 'tool_use') return 'tool-calls'
  if (stopReason === 'refusal') return 'content-filter'
  return 'unknown'
}
