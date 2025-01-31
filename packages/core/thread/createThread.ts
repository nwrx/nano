/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ObjectLike } from '@unshared/types'
import type { ComponentResolver, ReferenceResolver } from '../utils'
import type { Node } from './addNode'
import type { EventMetadata } from './createEventMetadata'
import { DEFAULT_COMPONENT_RESOLVER, DEFAULT_REFERENCE_RESOLVER, Emitter } from '../utils'

export type ThreadEvents = {

  /** When the thread is started. */
  'start': [input: ObjectLike, metadata: EventMetadata]

  /** When an error occurs during the execution of the flow outside of a node. */
  'error': [error: Error, metadata: EventMetadata]

  /** When the thread is aborted. */
  'abort': [metadata: EventMetadata]

  /** When the thread receives an input. */
  'input': [name: string, value: unknown, metadata: EventMetadata]

  /** When the thread outputs a value. */
  'output': [name: string, value: unknown, metadata: EventMetadata]

  /** When the thread is done. */
  'done': [output: ObjectLike, metadata: EventMetadata]

  /** When the state of a node changes. */
  'nodeState': [id: string, node: Node, metadata: EventMetadata]

  /** When a node emits an error event. */
  'nodeError': [id: string, node: Node, error: Error, metadata: EventMetadata]

  /** When a node emits a trace event. */
  'nodeTrace': [id: string, node: Node, trace: ObjectLike, metadata: EventMetadata]

  /** When a node is about to start processing. */
  'nodeStart': [id: string, node: Node, data: ObjectLike, metadata: EventMetadata]

  /** When a node is done processing. */
  'nodeDone': [id: string, node: Node, result: ObjectLike, metadata: EventMetadata]
}

/**
 * The options that are used to create a new flow instance. The options can be
 * used to configure the flow instance with custom settings and resolvers.
 * The options can also be used to resolve references to values that are only
 * available at runtime.
 */
export interface ThreadOptions {

  /**
   * The resolvers that are used to resolve the component based on a specifier.
   */
  componentResolvers?: ComponentResolver[]

  /**
   * The resolvers that are used to resolve the references. Typically used to
   * resolve the output of another nodes or some other value that is only
   * available at runtime.
   */
  referenceResolvers?: ReferenceResolver[]
}

/**
 * A `Thread` is a runtime instance of a flow that is used to run the flow
 * and collect the output of the flow. The thread is used to run the flow
 * in a separate context and collect the output of the flow.
 */
export class Thread extends Emitter<ThreadEvents> implements ThreadOptions {
  constructor(options: ThreadOptions = {}) {
    super()
    if (options.componentResolvers) this.componentResolvers.push(...options.componentResolvers)
    if (options.referenceResolvers) this.referenceResolvers.push(...options.referenceResolvers)
  }

  /** The time when the flow thread was started. */
  startedAt = -1

  /** The component instance that is used to run the flow thread. */
  nodes = new Map<string, Node>()

  /** The abort controller that is used to abort the flow thread. */
  abortController = new AbortController()

  /** The resolvers that are used to resolve the component kind. */
  componentResolvers: ComponentResolver[] = [DEFAULT_COMPONENT_RESOLVER]

  /** The resolvers that are used to resolve the references. */
  referenceResolvers: ReferenceResolver[] = [DEFAULT_REFERENCE_RESOLVER.bind(this)]
}

export function createThread(options: ThreadOptions = {}): Thread {
  return new Thread(options)
}
