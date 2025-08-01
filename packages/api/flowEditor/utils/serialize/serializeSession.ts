/* eslint-disable sonarjs/todo-tag */
import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import type { Editor } from '../types'
import { serializeSessionNode } from './serializeSessionNode'

/**
 * Serializes the current editor session into an Editor.State object.
 *
 * @param this The EditorSession to serialize.
 * @param peer The Peer object representing the current user.
 * @returns An Editor.State object containing the serialized session data.
 */
export function serializeSession(this: EditorSession, peer: Peer): Editor.State {
  const nodes = this.thread.nodes.keys().map(id => serializeSessionNode.call(this, id))

  // --- Serialize participants, excluding the current peer.
  const participants = this.participants
    .filter(participant => peer.id !== participant.peer.id)
    .map(participant => ({
      id: participant.peer.id,
      name: participant.user.username,
      color: participant.color,
      position: participant.position,
    }))

  return {
    flow: this.flow.serialize(),
    nodes: [...nodes] as unknown as Editor.NodeObject[],
    participants,
  }
}
