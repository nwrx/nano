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
 * Handle the `setNodesMetadata` event in the editor session.
 *
 * @param event The event data containing the node metadata values to set.
 * @returns A promise that resolves when the metadata values are set and saved.
 */
export async function handleNodesMetadataUpdate(this: EditorSession, event: MessageClientNodesMetadataUpdate): Promise<void> {
  for (const data of event.data) {
    try {
      setNodeMetadataValue(this.thread, data.id, data.name, data.value)
    }
    catch {
      continue
    }
  }

  this.broadcast({ event: 'nodes.metadata.changed', data: event.data })
  await this.saveFlow()
}
