import type { QuestionChoiceValue } from '../components'
import type { Thread } from './createThread'
import { createEventMetadata } from '../utils'

export interface EventResponse {
  id: string
  response: QuestionChoiceValue
}

export function sendResponse(thread: Thread, nodeId: string, eventId: string, response: QuestionChoiceValue): void {
  thread.dispatch(
    'nodeResponse',
    nodeId,
    { id: eventId, response },
    createEventMetadata(thread, nodeId),
  )
}
