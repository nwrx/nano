/* eslint-disable sonarjs/todo-tag */
import type { Node } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { FlowObject } from '../../flow/entities'
import type { RegistryComponentObject } from '../../registry'
import type { EditorSession } from './createEditorSession'
import { serializeSpecifier } from '@nwrx/nano/utils'
import { ModuleRegistry } from '../../registry'

export interface ParticipantObject {
  id: string
  name: string
  color: string
  position: { x: number; y: number }
}

export interface FlowNodeObject extends Omit<Node, 'component'> {
  id: string
  specifier: string
  component: RegistryComponentObject
}

export interface EditorState {
  flow: FlowObject
  nodes: FlowNodeObject[]
  participants: ParticipantObject[]
}

export async function serializeSessionNode(session: EditorSession, id: string): Promise<FlowNodeObject> {
  const moduleRegistry = session.moduleFlow.getModule(ModuleRegistry)
  const node = session.thread.nodes.get(id)
  if (!node) throw new Error('Node not found.')
  const specifier = serializeSpecifier(node)
  return await moduleRegistry.resolveComponent({ specifier })
    .then(component => ({
      id,
      specifier,
      ...node,
      component: component.serialize({
        withInputs: true,
        withOutputs: true,
        withCategories: true,
      }),
    }))
    .catch(() => ({
      id,
      specifier,
      ...node,
      component: {
        name: 'Unknown',
        version: 'Unknown',
        title: 'Unknown',
        description: 'Unknown',
        icon: 'Unknown',
        runtime: 'builtin',
      },
    }))
}

export async function serializeSession(session: EditorSession, peer: Peer): Promise<EditorState> {

  // --- Collect and serialize all nodes in the session.
  const nodes = session.thread.nodes.keys().map(id => serializeSessionNode(session, id))

  // --- Collect all participants in the session, excluding the current peer.
  const participants = session.participants
    .filter(participant => peer.id !== participant.peer.id)
    .map(participant => ({
      id: participant.peer.id,
      name: participant.user.username,
      color: participant.color,
      position: participant.position,
    }))

  // --- Return the serialized session data.
  return {
    flow: session.flow.serialize(),
    nodes: await Promise.all(nodes),
    participants,
  }
}
