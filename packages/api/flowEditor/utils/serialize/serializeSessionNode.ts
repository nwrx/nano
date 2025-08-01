/* eslint-disable sonarjs/todo-tag */
import type { EditorSession } from '../createEditorSession'
import type { Editor } from '../types'
import { serializeSpecifier } from '@nwrx/nano/utils'

/**
 * Serializes a session node into an Editor.NodeObject.
 *
 * @param id The ID of the node to serialize.
 * @returns An object representing the serialized node.
 * @throws Will throw an error if the node with the given ID does not exist.
 */
export function serializeSessionNode(this: EditorSession, id: string): Editor.NodeObject {
  const node = this.thread.nodes.get(id)
  if (!node) throw new Error('Node not found.')
  const specifier = serializeSpecifier(node)
  const { ...properties } = node
  return { id, specifier, ...properties }
}
