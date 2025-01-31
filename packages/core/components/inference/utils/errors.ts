import { createError } from '../../../utils'

export const INFERENCE_ERRORS = {

  // onResponsePushMessageDelta
  INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE: () => createError({
    message: 'Could not push message delta because the last message is missing.',
    name: 'E_INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE',
  }),
  INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_LAST_MESSAGE_NOT_ASSISTANT: () => createError({
    message: 'Could not push message delta because the last message is not from the assistant.',
    name: 'E_INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_LAST_MESSAGE_NOT_ASSISTANT',
  }),
  INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MESSAGE_NOT_ASSISTANT: () => createError({
    message: 'Could not push message delta because the input message delta is not from the assistant.',
    name: 'E_INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MESSAGE_NOT_ASSISTANT',
  }),
  INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE_CONTENT: () => createError({
    message: 'Could not push message delta because the last message content is missing.',
    name: 'E_INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_LAST_MESSAGE_CONTENT',
  }),
  INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_MESSAGE_CONTENT: () => createError({
    message: 'Could not push message delta because the input message content is missing.',
    name: 'E_INFERENCE_ON_RESPONSE_PUSH_MESSAGE_DELTA_MISSING_MESSAGE_CONTENT',
  }),

  // onResponseToolRequest
  INFERENCE_ON_RESPONSE_TOOL_REQUEST_MISSING_TOOLS: () => createError({
    message: 'Could not call the tool because no tools are provided.',
    name: 'E_INFERENCE_ON_RESPONSE_TOOL_REQUEST_MISSING_TOOLS',
  }),
  INFERENCE_ON_RESPONSE_TOOL_REQUEST_TOOL_NOT_FOUND: (name: string) => createError({
    message: `Could not find the tool "${name}".`,
    name: 'E_INFERENCE_ON_RESPONSE_TOOL_REQUEST_TOOL_NOT_FOUND',
    context: { name },
  }),
}
