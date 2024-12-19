import type { QuestionChoiceValue } from '../utils'
import type { Thread } from './createThread'
import { createEventMetadata } from '../utils'
import { getNode } from './getNode'

export interface EventResponse {
  id: string
  response: QuestionChoiceValue
}

export function sendResponse(thread: Thread, nodeId: string, eventId: string, response: QuestionChoiceValue): void {
  const node = getNode(thread, nodeId)
  const event: EventResponse = { id: eventId, response }
  thread.dispatch('nodeResponse', nodeId, event, createEventMetadata(thread, node))
}
