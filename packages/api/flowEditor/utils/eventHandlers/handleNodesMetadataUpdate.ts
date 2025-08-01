import type { EditorSession } from '../createEditorSession'
import { setNodeMetadataValue } from '@nwrx/nano'
import { assert, createParser, createRuleSet } from '@unshared/validation'

/** The parser schema for the `setNodesMetadata` event. */
export const MESSAGE_CLIENT_NODES_METADATA_UPDATE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.metadata.update'),
  data: assert.arrayOf(createRuleSet(
    [createParser({
      id: assert.stringNotEmpty,
      name: assert.stringEnum('label', 'comment'),
      value: assert.notNull,
    })],
    [createParser({
      id: assert.stringNotEmpty,
      name: assert.stringEnum('position'),
      value: {
        x: assert.number,
        y: assert.number,
      },
    })],
  )),
})

/** The type for the `setNodesMetadata` event. */
export type MessageClientNodesMetadataUpdate = ReturnType<typeof MESSAGE_CLIENT_NODES_METADATA_UPDATE_SCHEMA>

/**
 * The interface for the nodes metadata changed message sent to the server.
 * This message is broadcasted to all peers when node metadata is updated.
 */
export interface MessageServerNodesMetadataChanged {
  event: 'nodes.metadata.changed'
  data: Array<{ id: string; name: string; value: unknown }>
}

/**
 * Handle the `setNodesMetadata` event in the editor session.
 *
 * @param event The event data containing the node metadata values to set.
 * @returns A promise that resolves when the metadata values are set and saved.
 */
export async function handleNodesMetadataUpdate(this: EditorSession, event: MessageClientNodesMetadataUpdate): Promise<void> {
  const changedData: MessageServerNodesMetadataChanged['data'] = []

  for (const data of event.data) {
    try {
      const { id, name, value } = data
      setNodeMetadataValue(this.thread, id, name, value)
      changedData.push({ id, name, value })
    }
    catch {
      continue
    }
  }

  // --- Broadcast the metadata change to all peers.
  if (changedData.length === 0) return
  this.broadcast({ event: 'nodes.metadata.changed', data: changedData })
  await this.saveFlow()
}
