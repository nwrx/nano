import type { EditorSession } from '../createEditorSession'
import type { Editor } from '../types'
import { addNode } from '@nwrx/nano'
import { assert, createParser } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { serializeSessionNode } from '../serialize'

/** The parser schema for the `nodes.create` event. */
export const MESSAGE_CLIENT_NODES_CREATE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.create'),
  data: assert.arrayOf({
    specifier: assert.stringNotEmpty,
    initialInput: [[assert.undefined], [assert.objectStrict]],
    initialMetadata: [[assert.undefined], [assert.objectStrict]],
    x: assert.number,
    y: assert.number,
  }),
})

/** The type for the `nodes.create` event. */
export type MessageClientNodesCreate = ReturnType<typeof MESSAGE_CLIENT_NODES_CREATE_SCHEMA>

/** The result type for the `nodes.created` event. */
export interface MessageServerNodesCreated {
  event: 'nodes.created'
  data: Editor.NodeObject[]
}

/**
 * Handle the `nodes.create` event in the editor session.
 *
 * @param event The event data containing the nodes to create.
 * @returns A promise that resolves when the nodes are created and saved.
 */
export async function handleNodesCreate(this: EditorSession, event: MessageClientNodesCreate): Promise<void> {
  const nodes: Editor.NodeObject[] = []

  // --- Attempt to create each node.
  for (const data of event.data) {
    const id = addNode(this.thread, data.specifier, {
      id: randomUUID(),
      metadata: {
        position: { x: data.x, y: data.y },
        ...data.initialMetadata,
      },
      input: {
        ...data.initialInput,
      },
    })

    // --- Serialize the node and add it to the nodes array.
    const node = serializeSessionNode.call(this, id)
    nodes.push(node)
  }

  // --- Broadcast the created nodes.
  if (nodes.length === 0) return
  this.broadcast({ event: 'nodes.created', data: nodes })
  await this.saveFlow()
}
