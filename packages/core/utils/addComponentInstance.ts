import type { Thread } from '../createThread'
import type { Component } from './defineComponent'
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
  specifier: string
  input?: Record<string, unknown>
  metadata?: ComponentInstanceMetadata
  component?: Component
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
  const exists = thread.componentInstances.has(id)
  if (exists) throw new Error(`A component instance with ID "${id}" already exists in the thread.`)
  thread.componentInstances.set(id, copy)
  return id
}
