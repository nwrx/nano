/* eslint-disable sonarjs/todo-tag */
import type { Link } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { EditorSession } from './createEditorSession'
import type { EditorSessionServerMessage } from './editorSessionServerMessage'
import type { EditorNodeObject } from './serializeNode'
import { getLinks } from '@nwrx/nano'
import { serializeNode } from './serializeNode'

export interface EditorParticipantJSON {
  id: string
  name: string
  color: string
  position: { x: number; y: number }
}

export interface EditorSessionObject {
  name: string
  title: string
  icon: string
  description: string
  links: Link[]
  nodes: EditorNodeObject[]
  events: EditorSessionServerMessage[]
  secrets: string[]
  variables: string[]
  isRunning: boolean
  peerId: string
  peers: EditorParticipantJSON[]
}

export async function serializeSession(session: EditorSession, peer: Peer): Promise<EditorSessionObject> {
  const nodePromises = session.thread.nodes.keys().map(id => serializeNode.call(session, id))
  const nodes = await Promise.all(nodePromises)

  return {
    name: session.flow.name,
    title: session.flow.title,
    icon: 'i-carbon:flow',
    description: session.flow.description ?? '',
    nodes,
    links: getLinks(session.thread),
    isRunning: false, // session.thread.isRunning,
    events: [],
    secrets: [],
    variables: [],
    peerId: peer.id,
    peers: session.participants.map(peer => ({
      id: peer.peer.id,
      name: peer.peer.id,
      color: peer.color,
      position: peer.position,
    })),
  }
}
