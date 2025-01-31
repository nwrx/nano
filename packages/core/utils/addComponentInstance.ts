import type { Thread } from '../thread'
import type { ComponentInstance } from './types'
import { randomUUID } from 'node:crypto'

export function addComponentInstance(thread: Thread, componentInstance: ComponentInstance & { id?: string }) {
  if (thread.isRunning) throw new Error('Cannot add component instances while the thread is running.')
  const id = componentInstance.id ?? randomUUID()
  thread.componentInstances.set(id, componentInstance)
  return id
}
