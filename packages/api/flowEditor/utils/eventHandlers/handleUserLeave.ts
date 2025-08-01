import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `userLeave` event. */
export const MESSAGE_CLIENT_USER_LEAVE_SCHEMA = createParser({
  event: assert.stringEquals('user.leave'),
})

/** The type for the `userLeave` event. */
export type MessageClientUserLeave = ReturnType<typeof MESSAGE_CLIENT_USER_LEAVE_SCHEMA>

/**
 * The interface for the user left message sent to the server.
 * This message is broadcasted to all peers when a user leaves.
 */
export interface MessageServerUserLeft {
  event: 'user.left'
  data: {
    id: string
  }
}

/**
 * Handle the `userLeave` event in the editor session.
 *
 * @param event The event data for user leaving.
 * @param peer The peer that sent the event.
 */
export function handleUserLeave(this: EditorSession, event: MessageClientUserLeave, peer: Peer): void {
  this.unsubscribe(peer)
  this.broadcast({
    event: 'user.left',
    data: [{ id: peer.id }],
  }, peer)
}
