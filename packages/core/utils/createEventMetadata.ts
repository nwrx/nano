import type { NodeState, Thread } from '../thread'
import { getNode } from '../thread/getNode'

export interface EventMetadata {

  /** The timestamp when the event occurred. */
  timestamp: string

  /** The time difference between the thread start and the event occurrence. */
  delta: number

  /** If the event is associated with a node, the current state of the node. */
  state?: NodeState

  /** If the event is associated with a node, the time difference between the node start and the event occurrence. */
  duration?: number
}

/**
 * Creates a metadata object for a thread event.
 *
 * @param thread The thread to create the metadata for.
 * @param nodeId The node instance to create the metadata for.
 * @returns The metadata object for the thread event.
 */
export function createEventMetadata(thread: Thread, nodeId?: string): EventMetadata {
  const node = nodeId ? getNode(thread, nodeId) : undefined
  return {
    delta: thread.startedAt > 0 ? Date.now() - thread.startedAt : 0,
    timestamp: new Date().toISOString(),
    state: node?.state,
    duration: node ? Date.now() - node.startedAt : undefined,
  }
}
