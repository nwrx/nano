/* eslint-disable sonarjs/todo-tag */
import type { Peer } from 'crossws'
import type { EditorSession } from './createSession'
import type { EditorSessionServerMessage } from './editorSessionServerMessage'
import type { ComponentInstanceJSON } from './serializeComponentInstance'
import { type CategoryJSON, searchCategories } from './searchCategories'
import { serializeComponentInstance } from './serializeComponentInstance'

export interface EditorParticipantJSON {
  id: string
  name: string
  color: string
  position: { x: number; y: number }
}

export interface EditorSessionJSON {
  name: string
  icon: string
  description: string
  nodes: ComponentInstanceJSON[]
  categories: CategoryJSON[]
  events: EditorSessionServerMessage[]
  secrets: string[]
  variables: string[]
  isRunning: boolean
  peerId: string
  peers: EditorParticipantJSON[]
}

export interface LinkJSON {
  id: string
  name: string
  path?: string
}

export async function serializeSession(session: EditorSession, peer: Peer): Promise<EditorSessionJSON> {
  const nodePromises = session.thread.componentInstances.keys().map(id => serializeComponentInstance(session.thread, id))
  const nodes = await Promise.all(nodePromises)

  return {
    name: session.flow.title ?? 'Untitled Flow',
    icon: 'i-carbon:flow',
    description: session.flow.description ?? '',
    nodes,
    categories: await searchCategories(),
    isRunning: session.thread.isRunning,
    events: [],
    secrets: session.flow.project?.secrets?.map(secret => secret.name) ?? [],
    variables: session.flow.project?.variables?.map(variable => variable.name) ?? [],
    peerId: peer.id,
    peers: session.participants.map(peer => ({
      id: peer.peer.id,
      name: peer.peer.id,
      color: peer.color,
      position: peer.position,
    })),
  }
}
