import { UUID } from 'node:crypto'
import { Peer } from 'crossws'
import { lmNodeInference, lmNodeModelOpenai } from '@hsjm/oblisk-core/lm'
import { coreNodeEntrypoint } from '@hsjm/oblisk-core/core'
import { Chain } from '@hsjm/oblisk-core'
import { ModuleChain } from '../'

export interface ChainSessionPeer {
  peer: Peer
  color: string
  position: { x: number; y: number }
  removeListener: () => void
}

export class ChainSession {

  /**
   * Instantiate a new `ChainSession` with the given chain.
   *
   * @param chain The chain to create the session for.
   */
  constructor(public chain: Chain) {}

  /** The peers that are subscribed to the chain session. */
  peers: ChainSessionPeer[] = []

  /**
   * Check if the peer is already subscribed to the chain session.
   *
   * @param peer The peer to check.
   * @returns `true` if the peer is subscribed, `false` otherwise.
   */
  isSubscribed(peer: Peer) {
    return this.peers.some(p => p.peer.id === peer.id)
  }

  /**
   * Subscribe a peer to the chain session.
   *
   * @param peer The peer to subscribe.
   */
  subscribe(peer: Peer) {
    if (this.isSubscribed(peer)) return
    this.peers.push({
      peer,
      color: 'red',
      position: { x: 0, y: 0 },
      removeListener: this.chain.on('event', payload => peer.send(payload)),
    })
  }

  /**
   * Unsubscribe a peer from the chain session.
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
 * Given an ID, create or get the `ChainSession` that corresponds to the ID and
 * return it.
 *
 * @param id The ID to get the `ChainSession` for.
 * @returns The `ChainSession` that corresponds to the ID.
 */
export async function resolveChainSession(this: ModuleChain, id: UUID) {

  // --- Check if the chain session is already in memory.
  const session = this.chainsSessions.get(id)
  if (session) return session

  // --- Create a new chain session.

  const node1 = coreNodeEntrypoint('entrypoint-1')
  const node2 = lmNodeModelOpenai('lm-model-ollama-1')
  const node3 = lmNodeInference('lm-inference-1')
  const chain = new Chain()
  chain.addNode(node1, node2, node3)

  for (const node of chain.nodes) {
    await node.resolveDataSchema()
    await node.resolveResultSchema()
  }

  const newSession = new ChainSession(chain)
  this.chainsSessions.set(id, newSession)
  return newSession
}
