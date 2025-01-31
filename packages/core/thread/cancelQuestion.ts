import type { Thread } from './createThread'
import { createEventMetadata } from '../utils'
import { getNode } from './getNode'

export function cancelQuestion(thread: Thread, nodeId: string, eventId: string): void {
  const node = getNode(thread, nodeId)
  thread.dispatch('nodeQuestionCancel', nodeId, node, eventId, createEventMetadata(thread, node))
}
