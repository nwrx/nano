import type { ChatSession } from './createSession'

export function serializeThread(session: ChatSession) {
  return {
    id: this.id,
    flow: this.flow.id,
    createdBy: this.createdBy.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}
