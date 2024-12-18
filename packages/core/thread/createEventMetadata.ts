import type { Node, NodeState } from './addNode'
import type { Thread } from './createThread'

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
 * @param node The node instance to create the metadata for.
 * @returns The metadata object for the thread event.
 */
export function createEventMetadata(thread: Thread, node?: Node): EventMetadata {
  return {
    delta: thread.startedAt > 0 ? Date.now() - thread.startedAt : 0,
    timestamp: new Date().toISOString(),
    state: node?.state,
    duration: node ? Date.now() - node.startedAt : undefined,
  }
}
