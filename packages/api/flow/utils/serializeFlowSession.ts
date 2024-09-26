import type { FlowLink } from '@nwrx/core'
import type { Peer } from 'crossws'
import type { FlowSession } from './createFlowSession'
import type { FlowCategoryNodesJSON } from './serializeFlowCategories'
import type { FlowNodeInstanceJSON } from './serializeFlowNodeInstance'
import { serializeFlowCategories } from './serializeFlowCategories'
import { serializeFlowNodeInstance } from './serializeFlowNodeInstance'

/**
 * The serialized peer data that is sent to the client. The peer data includes
 * the peer's ID, name as well as the color and position assigned of it's cursor.
 */
export interface FlowSessionParticipantJSON {
  id: string
  name: string
  color: string
  position: { x: number; y: number }
}

/**
 * The serialized flow session data that is sent to the client. The flow session
 * data includes the flow, the peers and the events that have been triggered.
 */
export interface FlowSessionJSON {
  name: string
  icon: string
  description: string
  nodes: FlowNodeInstanceJSON[]
  links: FlowLink[]
  categories: FlowCategoryNodesJSON[]
  isRunning: boolean
  peerId: string
  peers: FlowSessionParticipantJSON[]
}

/**
 * Serialize the given flow session to JSON.
 *
 * @param session The flow session to serialize.
 * @param peer The peer that requested the serialization.
 * @returns The serialized flow session.
 */
export function serializeFlowSession(session: FlowSession, peer: Peer): FlowSessionJSON {
  return {
    name: session.flow.meta.name ?? 'Untitled Flow',
    icon: session.flow.meta.icon ?? 'i-carbon:flow',
    description: session.flow.meta.description ?? '',
    nodes: session.flow.nodes.map(serializeFlowNodeInstance),
    links: session.flow.links,
    categories: serializeFlowCategories(session.flow),
    isRunning: session.flow.isRunning,
    // isLocked: session.entity.isLocked,
    // isTouched: session.entity.isTouched,
    // isPublished: session.entity.isPublished,
    peerId: peer.id,
    peers: session.participants.map(peer => ({
      id: peer.peer.id,
      name: peer.peer.id,
      color: peer.color,
      position: peer.position,
    })),
  }
}
