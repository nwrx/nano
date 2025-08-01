import type { Node } from '@nwrx/nano'
import type { EditorSession } from '../createEditorSession'
import type { Editor } from '../types'
import { addNode } from '@nwrx/nano'
import { serializeSpecifier } from '@nwrx/nano/utils'
import { assert, createParser } from '@unshared/validation'
import { serializeSessionNode } from '../serialize'

/** The parser schema for the `cloneNodes` event. */
export const MESSAGE_CLIENT_NODES_CLONE_SCHEMA = createParser({
  event: assert.stringEquals('nodes.clone'),
  data: assert.arrayOf({
    ids: assert.arrayOf(assert.stringNotEmpty),
    origin: {
      x: assert.number,
      y: assert.number,
    },
  }),
})

/** The type for the `cloneNodes` event. */
export type MessageClientNodesClone = ReturnType<typeof MESSAGE_CLIENT_NODES_CLONE_SCHEMA>

/**
 * Handle the `cloneNodes` event in the editor session.
 *
 * @param event The event data containing the nodes to clone.
 * @returns A promise that resolves when the nodes are cloned and saved.
 */
export async function handleNodesClone(this: EditorSession, event: MessageClientNodesClone): Promise<void> {
  const [{ ids, origin }] = event.data
  const data: Editor.NodeObject[] = []

  // --- Find the left-top most node position.
  const sourceNodes = ids.map(id => this.thread.nodes.get(id)).filter(Boolean) as Node[]
  const sourcePositions = sourceNodes.map(node => node.metadata.position ?? { x: 0, y: 0 })
  const sourcePosition = {
    x: Math.min(...sourcePositions.map(p => p.x)),
    y: Math.min(...sourcePositions.map(p => p.y)),
  }

  // --- Create the cloned nodes.
  for (const sourceNode of sourceNodes) {
    const specifier = serializeSpecifier(sourceNode)
    const position = {
      x: origin.x + (sourceNode.metadata.position!.x - sourcePosition.x),
      y: origin.y + (sourceNode.metadata.position!.y - sourcePosition.y),
    }
    const id = addNode(this.thread, specifier, {
      input: { ...sourceNode.input },
      metadata: { ...sourceNode.metadata, position },
    })
    const node = serializeSessionNode.call(this, id)
    data.push(node)
  }

  // --- Broadcast the cloned nodes.
  this.broadcast({ event: 'nodes.created', data })
  await this.saveFlow()
}
