import type { QuestionChoiceValue } from '../components'
import type { Thread } from './createThread'
import { getNode } from './getNode'

export interface EventResponse {
  id: string
  response: QuestionChoiceValue
}

export function sendResponse(thread: Thread, nodeId: string, eventId: string, response: QuestionChoiceValue): void {
  getNode(thread, nodeId)
  thread.dispatch('nodeResponse', nodeId, { id: eventId, response } )
}
