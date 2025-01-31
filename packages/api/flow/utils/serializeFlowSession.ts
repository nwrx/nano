import type { Peer } from 'crossws'
import type { FlowSessionInstance } from './resolveFlowSession'
import type { FlowCategoryNodesJSON } from './serializeCategories'
import type { NodeInstanceJSON } from './serializeNodeInstance'
import { serializeCategories } from './serializeCategories'
import { serializeNodeInstance } from './serializeNodeInstance'

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
 * The serialized secret data that is sent to the client. The secret data includes
 * the secret's name as well as where it is comming from. Either from the
 * project or from the workspace.
 */
export interface FlowSessionSecretJSON {
  name: string
  from: 'project' | 'workspace'
}

/**
 * The serialized variable data that is sent to the client. The variable data includes
 * the variable's name and value as well as where it is comming from. Either from the
 * project or from the workspace.
 */
export interface FlowSessionVariableJSON {
  name: string
  value: string
  from: 'project' | 'workspace'
}

/**
 * The serialized flow session data that is sent to the client. The flow session
 * data includes the flow, the peers and the events that have been triggered.
 */
export interface FlowSessionJSON {
  name: string
  icon: string
  description: string
  nodes: NodeInstanceJSON[]
  categories: FlowCategoryNodesJSON[]
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
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
export function serializeFlowSession(session: FlowSessionInstance, peer: Peer): FlowSessionJSON {
  return {
    name: session.flow.meta.name ?? 'Untitled Flow',
    icon: session.flow.meta.icon ?? 'i-carbon:flow',
    description: session.flow.meta.description ?? '',
    nodes: session.flow.nodes.map(node => serializeNodeInstance(node)),
    categories: serializeCategories(),
    isRunning: session.flow.isRunning,
    secrets: session.flow.meta.secrets.map(name => ({ name, from: 'project' })),
    variables: session.flow.meta.variables.map(name => ({ name, value: '', from: 'project' })),
    peerId: peer.id,
    peers: session.participants.map(peer => ({
      id: peer.peer.id,
      name: peer.peer.id,
      color: peer.color,
      position: peer.position,
    })),
  }
}
