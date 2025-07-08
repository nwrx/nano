import type { StopReason } from '@anthropic-ai/sdk/resources'
import type { TextGeneration } from '../../textGeneration'

export function toFinishReason(stopReason: null | StopReason): TextGeneration.FinishReason {
  if (stopReason === 'end_turn') return 'stop'
  if (stopReason === 'stop_sequence') return 'stop'
  if (stopReason === 'pause_turn') return 'stop'
  if (stopReason === 'max_tokens') return 'length'
  if (stopReason === 'tool_use') return 'tool-calls'
  if (stopReason === 'refusal') return 'content-filter'
  return 'unknown'
}
