import type { ObjectLike } from '@unshared/types'
import type { ComponentResolver, ReferenceResolver } from '../utils'
import type { Node } from './addNode'
import type { ThreadEventMap } from './events'
import { Emitter } from '@unshared/functions/createEmitter'
import { DEFAULT_COMPONENT_RESOLVER } from '../utils/defaultComponentResolver'
import { DEFAULT_REFERENCE_RESOLVER } from '../utils/defaultReferenceResolver'

export type ThreadInputValue =
  | boolean
  | File
  | number
  | ReadableStream
  | string

export type ThreadInputObject = Record<string, ThreadInputValue>

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
export class Thread extends Emitter<ThreadEventMap> implements ThreadOptions {
  constructor(options: ThreadOptions = {}) {
    super()
    if (options.componentResolvers) this.componentResolvers = [...options.componentResolvers]
    if (options.referenceResolvers) this.referenceResolvers.push(...options.referenceResolvers)
  }

  /** The time when the flow thread was started. */
  startedAt = -1

  /** The component instance that is used to run the flow thread. */
  nodes = new Map<string, Node>()

  /** The output of the flow thread. */
  output: ObjectLike = {}

  /** The input of the flow thread. */
  input: ThreadInputObject = {}

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
