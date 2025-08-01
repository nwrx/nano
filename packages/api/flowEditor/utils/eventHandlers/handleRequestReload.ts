import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { assert, createParser } from '@unshared/validation'
import { serializeSession } from '../serialize'

/** The parser schema for the `userJoin` event. */
export const MESSAGE_CLIENT_REQUEST_RELOAD_SCHEMA = createParser({
  event: assert.stringEquals('request.reload'),
})

/** The type for the `syncronize` event. */
export type MessageClientRequestReload = ReturnType<typeof MESSAGE_CLIENT_REQUEST_RELOAD_SCHEMA>

/**
 * Handle the `syncronize` event in the editor session.
 *
 * @param event The event data for synchronization.
 * @param peer The peer that sent the event.
 */
export function handleRequestReload(this: EditorSession, event: MessageClientRequestReload, peer: Peer): void {
  this.sendMessage(peer, {
    event: 'request.reload.result',
    data: serializeSession.call(this, peer),
  })
}
