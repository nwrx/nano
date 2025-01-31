import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { Component } from '../module'
import type { ComponentInstance, Reference, ThreadEventMeta, ThreadEvents } from '../utils'
import { randomUUID } from 'node:crypto'
import { Emitter, getComponentInstance, getLinks, isNodeReadyToStart, isReferenceLink, resolveComponent, resolveSchema } from '../utils'
import { Node } from './createNode'

export const NODE_INPUT_KIND = 'core/input'
export const NODE_OUTPUT_KIND = 'core/output'

/**
 * The function that is used to resolve a reference to a value. The resolve
 * function is used to resolve the reference to a value that can be used in
 * the flow.
 */
export type ReferenceResolver = (reference: Reference) => MaybePromise<unknown>

/**
 * A function that is used to resolve a node definition. The resolve function
 * is used to resolve the node definition to a value that can be used in the
 * flow.
 */
export type ComponentResolver = (kind: string) => MaybePromise<Component | void>

/**
 * The options that are used to create a new flow instance. The options can be
 * used to configure the flow instance with custom settings and resolvers.
 * The options can also be used to resolve references to values that are only
 * available at runtime.
 */
export interface ThreadOptions {
  componentResolvers?: ComponentResolver[]
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

  /** The unique identifier of the flow thread. */
  readonly id = randomUUID()

  /** The time when the flow thread was started. */
  startedAt = 0

  /** The component instance that is used to run the flow thread. */
  componentInstances = new Map<string, ComponentInstance>()

  /** The nodes that are currently running in the flow thread. */
  nodes = new Map<string, Node>()

  /** The abort controller that is used to abort the flow thread. */
  abortController = new AbortController()

  /** The resolvers that are used to resolve the component kind. */
  componentResolvers = [] as ComponentResolver[]

  referenceResolvers = [
    (reference) => {
      if (isReferenceLink(reference)) {
        const { id, name } = reference.$fromNode
        const node = this.nodes.get(id)
        if (!node) return
        return node.result[name]
      }
    },
  ] as ReferenceResolver[]

  /***************************************************************************/
  /* Helpers                                                                 */
  /***************************************************************************/

  private get eventMetadata(): ThreadEventMeta {
    return {
      threadId: this.id,
      threadDelta: Date.now() - this.startedAt,
      timestamp: Date.now(),
    }
  }

  public get isRunning() {
    for (const node of this.nodes.values()) {
      const isNodeRunning = node.state === 'PROCESSING'
      if (isNodeRunning) return true
    }
    return false
  }

  /***************************************************************************/
  /* Runtime                                                                 */
  /***************************************************************************/

  /** Aborts the flow thread. */
  abort() {
    this.abortController.abort()
    this.dispatch('abort', this.eventMetadata)
    this.abortController = new AbortController()
    for (const [, node] of this.nodes) node.abort()
  }

  async start(threadInput: ObjectLike = {}) {
    const threadOutput: ObjectLike = {}
    const links = getLinks(this)

    this.nodes.clear()
    this.startedAt = Date.now()
    this.dispatch('start', threadInput, this.eventMetadata)

    // --- Resolve all components.
    const components = new Map<string, Component>()
    for (const [id, componentInstance] of this.componentInstances) {
      const component = await resolveComponent(componentInstance.kind, this.componentResolvers)
      components.set(id, component)
    }

    return new Promise<ObjectLike>((resolve) => {
      for (const [id, componentInstance] of this.componentInstances) {
        const component = components.get(id)!
        const node = new Node(component)
        this.nodes.set(id, node)
        node.on('state', meta => this.dispatch('nodeState', id, { ...meta, ...this.eventMetadata }))
        node.on('trace', (data, meta) => this.dispatch('nodeTrace', id, data, { ...meta, ...this.eventMetadata }))

        // --- If the node is an input, apply the input value to the thread input.
        node.on('start', (context, meta) => {
          this.dispatch('nodeStart', id, context, { ...meta, ...this.eventMetadata })
          const { data, result } = context
          if (componentInstance.kind === NODE_INPUT_KIND) {
            const name = data.name as string
            result.value = threadInput[name]
          }
        })

        // --- Dispatch the node error event if the node emits an error.
        node.on('error', (error, meta) => {
          this.dispatch('nodeError', id, error, { ...meta, ...this.eventMetadata })
          if (this.isRunning) return
          this.dispatch('end', threadOutput, this.eventMetadata)
          this.abort()
          return resolve(threadOutput)
        })

        // --- If the node is an output, we collect this specific output value and it's corresponding name
        // --- and apply it to the thread output. We also dispatch the output event with the name and value.
        node.on('end', async(context, meta) => {
          this.dispatch('nodeEnd', id, context, { ...meta, ...this.eventMetadata })

          // --- If the node is an output, apply the output value to the thread output.
          if (componentInstance.kind === NODE_OUTPUT_KIND) {
            const name = context.data.name as string
            const value = context.data.value
            threadOutput[name] = value
            this.dispatch('output', name, value, this.eventMetadata)
          }

          // --- If the node has outgoing links, start the next nodes
          // --- if all their incoming nodes are done.
          const outgoingLinks = links.filter(link => link.sourceId === id)
          for (const link of outgoingLinks) {
            const target = getComponentInstance(this, link.targetId)
            const targetNode = this.nodes.get(link.targetId)!
            const targetComponent = components.get(link.targetId)!
            if (!target) continue
            if (!isNodeReadyToStart(this, link.targetId)) continue
            const data = await resolveSchema({
              data: target.input,
              resolvers: this.referenceResolvers,
              schema: targetComponent.inputSchema,
            })
            void targetNode.process(data)
          }

          // --- If all the nodes are done, dispatch the end event.
          setTimeout(() => {
            if (this.isRunning) return
            this.dispatch('end', threadOutput, this.eventMetadata)
            return resolve(threadOutput)
          }, 100)
        })

        // --- If the node has no incoming links, start the node immediately.
        const hasIncomingLinks = links.some(link => link.targetId === id)
        if (hasIncomingLinks) continue
        const dataPromise = resolveSchema({
          data: componentInstance.input,
          resolvers: this.referenceResolvers,
          schema: component.inputSchema,
        })
        void dataPromise.then(data => node.process(data))
      }
    })
  }
}

export function createThread(options?: ThreadOptions): Thread {
  return new Thread(options)
}
