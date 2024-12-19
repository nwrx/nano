import type { Component, SpecifierObject } from '../utils'
import type { Thread } from './createThread'
import { ERRORS as E, parseSpecifier } from '../utils'

export interface NodeMetadata {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  inputVisibility?: Record<string, true | undefined>
  outputVisibility?: Record<string, true | undefined>
  [key: string]: unknown
}

export interface NodeOptions {
  id?: string
  input?: Record<string, unknown>
  metadata?: NodeMetadata
  component?: Component
}

export type NodeState =
  | 'done'
  | 'error'
  | 'idle'
  | 'paused'
  | 'processing'
  | 'starting'

export interface Node extends SpecifierObject {
  input: Record<string, unknown>
  result: Record<string, unknown>
  metadata: NodeMetadata
  state: NodeState
  error?: Error
  startedAt: number
  component?: Component
}

/**
 * Add a component instance to the thread.
 *
 * @param thread The thread to add the component instance to.
 * @param specifier The specifier of the component to add.
 * @param options The component instance to add.
 * @returns The ID of the added component instance.
 * @example addNode(thread, { specifier: 'core/log', input: { message: 'Hello, world!' } })
 */
export function addNode(thread: Thread, specifier: string, options: NodeOptions = {}): string {
  const {
    component,
    input = {},
    metadata= {},
  } = options

  // --- Check if the component instance already exists in the thread.
  // eslint-disable-next-line sonarjs/pseudo-random
  const id = options.id ?? Math.random().toString(36).slice(2)
  const exists = thread.nodes.has(id)
  if (exists) throw E.NODE_DUPLICATE_ID(id)

  // --- Add the component instance to the thread.
  thread.nodes.set(id, {
    ...parseSpecifier(specifier),
    input,
    metadata,
    component,
    result: {},
    startedAt: 0,
    state: 'idle',
  })

  // --- Return the ID of the added component instance.
  return id
}
