import type { Thread } from '../thread'
import { randomUUID } from 'node:crypto'
import { getNode } from '../thread'
import { createEventMetadata } from './createEventMetadata'

export interface NotifyActionOptions {
  name: string
  description?: string
  steps?: Array<{
    text: string
    state: 'error' | 'pending' | 'success'
  }>
}

export interface ActionNotification extends NotifyActionOptions {
  id: string
}

export function notifyAction(thread: Thread, nodeId: string, options: NotifyActionOptions): void {
  const node = getNode(thread, nodeId)
  const event: ActionNotification = { id: randomUUID(), ...options }
  thread.dispatch('nodeAction', nodeId, node, event, createEventMetadata(thread, node))
}
