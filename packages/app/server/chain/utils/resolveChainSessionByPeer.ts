import { Peer } from 'crossws'
import { ModuleChain } from '..'

/**
 * Given a `Peer` instance, find the chain session that the peer is
 * subscribed to. If the peer is not subscribed to any chain session,
 * return `undefined`.
 *
 * @param peer The peer to find the chain session for.
 * @returns The chain session that the peer is subscribed to.
 */
export function resolveChainSessionByPeer(this: ModuleChain, peer: Peer) {
  for (const [,session] of this.chainsSessions) {
    for (const sessionPeer of session.peers) {
      if (sessionPeer.peer.id === peer.id)
        return session
    }
  }
}
