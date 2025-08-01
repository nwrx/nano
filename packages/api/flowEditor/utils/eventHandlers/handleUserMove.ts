import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `setUserPosition` event. */
export const MESSAGE_CLIENT_USER_MOVE_SCHEMA = createParser({
  event: assert.stringEquals('user.move'),
  data: assert.arrayOf(assert.number),
})

/** The type for the `setUserPosition` event. */
export type MessageClientUserMove = ReturnType<typeof MESSAGE_CLIENT_USER_MOVE_SCHEMA>

/**
 * Handle the `setUserPosition` event in the editor session.
 *
 * @param event The event data containing the user position.
 * @param peer The peer that sent the event.
 */
export function handleUserMove(this: EditorSession, event: MessageClientUserMove, peer: Peer): void {

  // --- Update the user's position in the session.
  const participant = this.participants.find(p => p.peer.id === peer.id)
  if (participant) {
    participant.position = {
      x: event.data[0],
      y: event.data[1],
    }
  }

  // --- Broadcast the position change to all peers except the sender.
  this.broadcast({
    event: 'user.moved',
    data: [{
      id: peer.id,
      x: event.data[0],
      y: event.data[1],
    }],
  }, peer)
}
