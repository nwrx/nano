import type { Thread } from './createThread'
import { createEventMetadata } from '../utils/createEventMetadata'

export function cancelQuestion(thread: Thread, nodeId: string, eventId: string): void {
  thread.dispatch(
    'nodeQuestionCancel',
    nodeId,
    eventId,
    createEventMetadata(thread, nodeId),
  )
}
