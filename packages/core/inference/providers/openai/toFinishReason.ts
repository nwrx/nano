import type { ChatCompletion } from 'openai/resources'
import type { TextGeneration } from '../../textGeneration'

export function toFinishReason(finishReason?: ChatCompletion.Choice['finish_reason'] | null): TextGeneration.FinishReason {
  if (finishReason === 'stop')
    return 'stop'
  else if (finishReason === 'length')
    return 'length'
  else if (finishReason === 'content_filter')
    return 'content-filter'
  else if (finishReason === 'tool_calls' || finishReason === 'function_call')
    return 'tool-calls'
  return 'unknown'
}
