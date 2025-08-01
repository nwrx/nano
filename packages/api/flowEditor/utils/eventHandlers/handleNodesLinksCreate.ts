import type { EditorSession } from '../createEditorSession'
import { addLink } from '@nwrx/nano'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `createLinks` event. */
export const MESSAGE_CLIENT_NODES_LINKS_CREATE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.links.create'),
  data: assert.arrayOf({
    sourceId: assert.stringNotEmpty,
    sourceName: assert.stringNotEmpty,
    sourcePath: [[assert.undefined], [assert.stringNotEmpty]],
    targetId: assert.stringNotEmpty,
    targetName: assert.stringNotEmpty,
    targetPath: [[assert.undefined], [assert.stringNotEmpty]],
  }),
})

/** The type for the `createLinks` event. */
export type MessageClientNodesLinksCreate = ReturnType<typeof MESSAGE_CLIENT_NODES_LINKS_CREATE_SCHEMA>

/**
 * Handle the `createLinks` event in the editor session.
 *
 * @param event The event data containing the links to create.
 * @returns A promise that resolves when the links are created and saved.
 */
export async function handleNodesLinksCreate(this: EditorSession, event: MessageClientNodesLinksCreate): Promise<void> {
  const results = []
  for (const link of event.data) {
    const { id, name, value } = await addLink(this.thread, link)
    results.push({ id, name, value })
  }
  this.broadcast({ event: 'nodes.input.changed', data: results })
  await this.saveFlow()
}
