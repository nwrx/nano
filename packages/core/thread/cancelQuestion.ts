import type { Thread } from './createThread'
import { getNode } from './getNode'

export function cancelQuestion(thread: Thread, nodeId: string, eventId: string): void {
  getNode(thread, nodeId)
  thread.dispatch('nodeQuestionCancel', nodeId, eventId)
}
