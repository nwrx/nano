import type { Component } from '../utils'
import type { Thread } from './createThread'
import { randomUUID } from 'node:crypto'

export interface ComponentInstanceMetadata {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  inputVisibility?: Record<string, true | undefined>
  outputVisibility?: Record<string, true | undefined>
  [key: string]: unknown
}

export interface ComponentInstanceOptions {
  id?: string
  input?: Record<string, unknown>
  metadata?: ComponentInstanceMetadata
  component?: Component
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
 * @param specifier The specifier of the component to add.
 * @param options The component instance to add.
 * @returns The ID of the added component instance.
 * @example add(thread, { specifier: 'core/log', input: { message: 'Hello, world!' } })
 */
export function add(thread: Thread, specifier: string, options: ComponentInstanceOptions = {}): string {
  const { id = randomUUID(), ...instance } = options
  const exists = thread.componentInstances.has(id)
  if (exists) throw new Error(`A component instance with ID "${id}" already exists in the thread.`)
  thread.componentInstances.set(id, { ...instance, specifier })
  return id
}
