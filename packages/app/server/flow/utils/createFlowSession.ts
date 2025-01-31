import type { Flow as FlowInstance } from '@nanoworks/core'
import type { Peer } from 'crossws'
import type { Flow } from '../entities'

export interface FlowSessionPeer {
  peer: Peer
  color: string
  position: { x: number; y: number }
  removeListener: () => void
}

export class FlowSession {

  /**
   * Instantiate a new `FlowSession` with the given flow.
   *
   * @param flow The flow to create the session for.
   * @param entity The flow entity as stored in the database.
   */
  constructor(
    public flow: FlowInstance,
    public entity: Flow,
  ) {}

  /** The peers that are subscribed to the flow session. */
  peers: FlowSessionPeer[] = []

  /**
   * Check if the peer is already subscribed to the flow session.
   *
   * @param peer The peer to check.
   * @returns `true` if the peer is subscribed, `false` otherwise.
   */
  isSubscribed(peer: Peer) {
    return this.peers.some(p => p.peer.id === peer.id)
  }

  /**
   * Subscribe a peer to the flow session.
   *
   * @param peer The peer to subscribe.
   */
  subscribe(peer: Peer) {
    if (this.isSubscribed(peer)) return
    this.peers.push({
      peer,
      color: 'red',
      position: { x: 0, y: 0 },

      // --- This line will bind every events emitted by the `Flow` instance to the peer(s)
      // --- Additionally, calling the return value of the `on` method will remove the listener.
      removeListener: this.flow.on('event', payload => peer.send(payload, { compress: true }) ),
    })
  }

  /**
   * Unsubscribe a peer from the flow session.
   *
   * @param peer The peer to unsubscribe.
   */
  unsubscribe(peer: Peer) {
    if (!this.isSubscribed(peer)) return
    const peerToRemove = this.peers.find(p => p.peer.id === peer.id)
    if (!peerToRemove) return
    peerToRemove.removeListener()
    this.peers = this.peers.filter(p => p.peer.id !== peer.id)
  }
}

/**
 * Create a new `FlowSession` with the given flow.
 *
 * @param flow The flow to create the session for.
 * @param entity The flow entity as stored in the database.
 * @returns The new `FlowSession` instance.
 */
export function createFlowSession(flow: FlowInstance, entity: Flow): FlowSession {
  return new FlowSession(flow, entity)
}
