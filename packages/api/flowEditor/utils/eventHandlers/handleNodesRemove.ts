import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { removeNode } from '@nwrx/nano'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `removeNodes` event. */
export const MESSAGE_CLIENT_NODES_REMOVE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.remove'),
  data: assert.arrayOf(assert.stringNotEmpty),
})

/** The type for the `removeNodes` event. */
export type MessageClientNodesRemove = ReturnType<typeof MESSAGE_CLIENT_NODES_REMOVE_SCHEMA>

/**
 * Handle the `removeNodes` event in the editor session.
 *
 * @param event The event data containing the node IDs to remove.
 * @param peer The peer that sent the event.
 * @returns A promise that resolves when the nodes are removed and saved.
 */
export async function handleNodesRemove(this: EditorSession, event: MessageClientNodesRemove, peer: Peer): Promise<void> {
  const removedNodes: string[] = []
  for (const nodeId of event.data) {
    try {
      await removeNode(this.thread, nodeId)
      removedNodes.push(nodeId)
    }
    catch (error) {
      peer.send({
        event: 'error',
        message: `Failed to remove node ${nodeId}: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  // --- Broadcast the removed nodes to all peers in the session.
  this.broadcast({ event: 'nodes.removed', data: removedNodes })
  await this.saveFlow()
}
