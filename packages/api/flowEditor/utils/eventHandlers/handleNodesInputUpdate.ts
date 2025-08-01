import type { EditorSession } from '../createEditorSession'
import { setNodeInputValue } from '@nwrx/nano'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `setNodesInputValue` event. */
export const MESSAGE_CLIENT_NODES_INPUT_UPDATE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.input.update'),
  data: assert.arrayOf({
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    value: assert.notNull,
  }),
})

/** The type for the `setNodesInputValue` event. */
export type MessageClientNodesInputUpdate = ReturnType<typeof MESSAGE_CLIENT_NODES_INPUT_UPDATE_SCHEMA>

/**
 * The interface for the nodes input changed message sent to the server.
 * This message is broadcasted to all peers when node inputs are updated.
 */
export interface MessageServerNodesInputChanged {
  event: 'nodes.input.changed'
  data: Array<{
    id: string
    name: string
    value: unknown
  }>
}

/**
 * Handle the `setNodesInputValue` event in the editor session.
 *
 * @param message The message containing the node input values to set.
 * @returns A promise that resolves when the input values are set and saved.
 */
export async function handleNodesInputUpdate(this: EditorSession, message: MessageClientNodesInputUpdate): Promise<void> {
  for (const data of message.data) {
    const { id, name, value } = data
    setNodeInputValue(this.thread, id, name, value)
  }
  this.broadcast({ event: 'nodes.input.changed', data: message.data })
  await this.saveFlow()
}
