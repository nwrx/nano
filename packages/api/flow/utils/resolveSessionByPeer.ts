import type { Peer } from 'crossws'
import type { ModuleFlow } from '../index'
import type { EditorSession } from './createSession'

export function resolveSessionByPeer(this: ModuleFlow, peer: Peer): EditorSession {
  for (const [,session] of this.flowEditorSessions) {
    for (const sessionPeer of session.participants)
      if (sessionPeer.peer.id === peer.id) return session
  }
  throw new Error('Session not found.')
}
