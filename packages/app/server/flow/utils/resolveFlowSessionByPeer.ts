import type { Peer } from 'crossws'
import type { ModuleFlow } from '..'
import type { FlowSession } from './createFlowSession'

/**
 * Given a `Peer` instance, find the chain session that the peer is
 * subscribed to. If the peer is not subscribed to any chain session,
 * return `undefined`.
 *
 * @param peer The peer to find the chain session for.
 * @returns The chain session that the peer is subscribed to.
 */
export function resolveFlowSessionByPeer(this: ModuleFlow, peer: Peer): FlowSession | undefined {
  for (const [,session] of this.flowSessions) {
    for (const sessionPeer of session.peers) {
      if (sessionPeer.peer.id === peer.id)
        return session
    }
  }
}
