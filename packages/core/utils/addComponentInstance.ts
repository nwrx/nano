import type { Thread } from '../createThread'
import { randomUUID } from 'node:crypto'

export interface ComponentInstanceMetadata {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  inputVisibility?: Record<string, true | undefined>
  outputVisibility?: Record<string, true | undefined>
  [key: string]: unknown
}

export interface ComponentInstance {
  kind: string
  input?: Record<string, unknown>
  metadata?: ComponentInstanceMetadata
}

/**
 * Add a component instance to the thread.
 *
 * @param thread The thread to add the component instance to.
 * @param componentInstance The component instance to add to the thread.
 * @returns The ID of the added component instance.
 */
export function addComponentInstance(thread: Thread, componentInstance: ComponentInstance & { id?: string }) {
  const { id = randomUUID(), ...copy } = componentInstance
  thread.componentInstances.set(id, copy)
  return id
}
