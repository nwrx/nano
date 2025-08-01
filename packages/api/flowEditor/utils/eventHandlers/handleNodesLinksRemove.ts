import type { EditorSession } from '../createEditorSession'
import { removeLink } from '@nwrx/nano'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `removeLinks` event. */
export const MESSAGE_CLIENT_NODES_LINKS_REMOVE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.links.remove'),
  data: assert.arrayOf({
    sourceId: [[assert.undefined], [assert.stringNotEmpty]],
    sourceName: [[assert.undefined], [assert.stringNotEmpty]],
    sourcePath: [[assert.undefined], [assert.stringNotEmpty]],
    targetId: [[assert.undefined], [assert.stringNotEmpty]],
    targetName: [[assert.undefined], [assert.stringNotEmpty]],
    targetPath: [[assert.undefined], [assert.stringNotEmpty]],
  }),
})

/** The type for the `removeLinks` event. */
export type MessageClientNodesLinksRemove = ReturnType<typeof MESSAGE_CLIENT_NODES_LINKS_REMOVE_SCHEMA>

/**
 * Handle the `removeLinks` event in the editor session.
 *
 * @param event The event data containing the links to remove.
 * @returns A promise that resolves when the links are removed and saved.
 */
export async function handleNodesLinksRemove(this: EditorSession, event: MessageClientNodesLinksRemove): Promise<void> {
  const [link] = event.data
  const data = await removeLink(this.thread, link)
  this.broadcast({ event: 'nodes.input.changed', data })
  await this.saveFlow()
}
