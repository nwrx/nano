import type { EditorSession } from '../createEditorSession'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `setMetadata` event. */
export const MESSAGE_CLIENT_METADATA_UPDATE_SCHEMA = createParser({
  event: assert.stringEquals('metadata.update'),
  data: assert.arrayOf({
    name: assert.stringEnum('title', 'description'),
    value: assert.string,
  }),
})

/** The type for the `setMetadata` event. */
export type EventMetadataUpdate = ReturnType<typeof MESSAGE_CLIENT_METADATA_UPDATE_SCHEMA>

/**
 * Handle the `setMetadata` event in the editor session.
 *
 * @param event The event data containing metadata changes.
 * @returns A promise that resolves when metadata is updated and saved.
 */
export async function handleMetadataUpdate(this: EditorSession, event: EventMetadataUpdate): Promise<void> {

  // --- Update the flow metadata.
  for (const data of event.data) {
    if (data.name === 'title') this.flow.title = data.value
    else if (data.name === 'description') this.flow.description = data.value
  }

  // --- Broadcast the metadata change to all peers.
  this.broadcast({ event: 'metadata.changed', data: event.data })
  await this.saveFlow()
}
