/* eslint-disable sonarjs/prefer-single-boolean-return */
import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { NodeEventMeta, NodeInstance, NodeInstanceOptions, NodeState } from './createNodeInstance'
import type { DataSchema } from './defineDataSchema'
import type { Node } from './defineNode'
import type { ResultSchema } from './defineResultSchema'
import { randomUUID } from 'node:crypto'
import { createNodeInstance } from './createNodeInstance'

/** The kind of the input node. */
export const NODE_INPUT_KIND = 'nwrx/core:input'

/** The kind of the output node. */
export const NODE_OUTPUT_KIND = 'nwrx/core:output'

export interface FlowEventMeta {
  threadId: string
  delta: number
  timestamp: number
}

export interface FlowEvents {

  // Node
  'node:create': [node: NodeInstance]
  'node:remove': [node: NodeInstance]
  'node:state': [node: NodeInstance, state: NodeState, meta: NodeEventMeta]
  'node:meta': [node: NodeInstance, key: string, value: unknown, meta: NodeEventMeta]

  // Node Data & Result
  'node:data': [node: NodeInstance, data: Record<string, unknown>, meta: NodeEventMeta]
  'node:dataSchema': [node: NodeInstance, schema: DataSchema, meta: NodeEventMeta]
  'node:dataParseError': [node: NodeInstance, key: string, error: Error, meta: NodeEventMeta]
  'node:result': [node: NodeInstance, result: Record<string, unknown>, meta: NodeEventMeta]
  'node:resultSchema': [node: NodeInstance, schema: ResultSchema, meta: NodeEventMeta]
  'node:resultParseError': [node: NodeInstance, key: string, error: Error, meta: NodeEventMeta]

  // Node Lifecycle
  'node:start': [node: NodeInstance, data: Record<string, unknown>, meta: NodeEventMeta]
  'node:end': [node: NodeInstance, data: Record<string, unknown>, result: Record<string, unknown>, meta: NodeEventMeta]
  'node:abort': [node: NodeInstance, meta: NodeEventMeta]
  'node:error': [node: NodeInstance, error: Error, meta: NodeEventMeta]

  // Flow
  'flow:meta': [key: string, value: unknown]
  'flow:input': [name: string, value: unknown, meta: FlowEventMeta]
  'flow:output': [name: string, value: unknown, meta: FlowEventMeta]

  // Flow Lifecycle
  'flow:start': [input: Record<string, unknown>, meta: FlowEventMeta]
  'flow:abort': [output: Record<string, unknown>, meta: FlowEventMeta]
  'flow:end': [output: Record<string, unknown>, meta: FlowEventMeta]
  'flow:error': [error: Error, meta: FlowEventMeta]
}

export type FlowListener<K extends keyof FlowEvents> = (...data: FlowEvents[K]) => void

export interface FlowMeta {
  name?: string
  slug?: string
  icon?: string
  description?: string
  [key: string]: unknown
}

export interface FlowOptions {
  meta?: FlowMeta
  resolveNode?: (kind: string) => MaybePromise<Node>
  resolveReference?: (flow: Flow, type: string, name: string) => MaybePromise<unknown>
}

export interface Link {
  sourceId: string
  sourceKey: string
  targetId: string
  targetKey: string
}

/**
 * The `FlowContext` is a map of variables that are shared between all nodes
 * in the flow during the execution of the flow. The context is used to store
 * variables that are used by multiple nodes in the flow and that need to be
 * shared between the nodes. Note that the context is not persisted between
 * flow executions and is reset when the flow is started.
 */
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface FlowContext {
  [key: PropertyKey]: unknown
}

/**
 * a `Flow` is a collection of `Node`s that are linked together. The flow
 * is processed by executing the entrypoint and letting the nodes trigger each
 * other.
 *
 * The flow also provides a way to dispatch and listen for events that are
 * triggered by changes in the flow.
 */
export class Flow implements Disposable, FlowOptions {
  constructor(options: FlowOptions = {}) {
    this.meta = options.meta ?? {}
    this.resolveNode = options.resolveNode ?? (() => { throw new Error('The `resolveNode` function is not defined') })
    this.resolveReference = options.resolveReference ?? (() => { throw new Error('The `resolveReference` function is not defined') })
  }

  public meta
  public resolveNode
  public resolveReference

  public nodes = [] as NodeInstance[]
  public context = {} as FlowContext
  public isRunning = false
  public isDestroyed = false

  /***************************************************************************/
  /* Private methods                                                         */
  /***************************************************************************/

  public threadId = randomUUID() as string
  public threadStart = Date.now()
  public eventTarget = new EventTarget()
  public eventHandlers = new Map<string, EventListener>()
  public input = {} as Record<string, unknown>
  public output = {} as Record<string, unknown>

  private dispatch<K extends keyof FlowEvents>(event: K, ...data: FlowEvents[K]) {
    const customEvent = new CustomEvent(event as string, { detail: data })
    this.eventTarget.dispatchEvent(customEvent)
  }

  private get eventMeta(): FlowEventMeta {
    return {
      threadId: this.threadId,
      delta: Date.now() - this.threadStart,
      timestamp: Date.now(),
    }
  }

  private get links(): Link[] {
    const links: Link[] = []
    for (const node of this.nodes) {
      for (const key in node.data) {
        const value = node.data[key]

        // --- If the value is an array, iterate over each value and add the links.
        if (Array.isArray(value)) {
          for (const v of value) {
            const link = this.linkParse(v)
            if (!link) continue
            links.push({
              sourceId: link.sourceId,
              sourceKey: link.sourceKey,
              targetId: node.id,
              targetKey: key,
            })
          }
        }

        // --- Otherwise, add the link if the value is a link.
        else {
          const link = this.linkParse(value)
          if (!link) continue
          links.push({
            sourceId: link.sourceId,
            sourceKey: link.sourceKey,
            targetId: node.id,
            targetKey: key,
          })
        }
      }
    }
    return links
  }

  private linkStringify(sourceId: string, sourceKey: string): string {
    return `$NODE.${sourceId}:${sourceKey}`
  }

  private linkParse(value: unknown): { sourceId: string; sourceKey: string } | undefined {
    if (typeof value !== 'string') return
    const LINK_EXP = /^\$NODE\.(?<sourceId>[^:]+):(?<sourceKey>\w+)$/
    const match = LINK_EXP.exec(value)
    if (!match) return
    const { sourceId, sourceKey } = match.groups!
    return { sourceId, sourceKey }
  }

  private bind(instance: NodeInstance): void {
    const isAlreadyBound = this.nodes.includes(instance)
    if (isAlreadyBound) throw new Error('The node instance is already bound to the flow')

    // --- Bind the instance and flow together.
    instance.flow = this
    this.nodes.push(instance)

    instance.on('data', (...payload) => this.dispatch('node:data', instance, ...payload))
    instance.on('dataSchema', (...payload) => this.dispatch('node:dataSchema', instance, ...payload))
    instance.on('dataParseError', (...payload) => this.dispatch('node:dataParseError', instance, ...payload))
    instance.on('result', (...payload) => this.dispatch('node:result', instance, ...payload))
    instance.on('resultSchema', (...payload) => this.dispatch('node:resultSchema', instance, ...payload))
    instance.on('resultParseError', (...payload) => this.dispatch('node:resultParseError', instance, ...payload))
    instance.on('state', (...payload) => this.dispatch('node:state', instance, ...payload))
    instance.on('meta', (...payload) => this.dispatch('node:meta', instance, ...payload))
    instance.on('start', (...payload) => this.dispatch('node:start', instance, ...payload))
    instance.on('end', (...payload) => this.dispatch('node:end', instance, ...payload))
    instance.on('abort', (...payload) => this.dispatch('node:abort', instance, ...payload))
    instance.on('error', (...payload) => this.dispatch('node:error', instance, ...payload))
  }

  /***************************************************************************/
  /* Public methods                                                          */
  /***************************************************************************/

  /**
   * Add a listener for a flow event. The listener is called when the event is
   * dispatched by the flow.
   *
   * @param event The event to listen for.
   * @param listener The listener to call when the event is dispatched.
   * @returns A function that removes the listener when called.
   */
  public on<K extends keyof FlowEvents>(event: K, listener: FlowListener<K>) {
    const callback = (event: Event) => listener(...(event as CustomEvent).detail as FlowEvents[K])
    this.eventTarget.addEventListener(event, callback)
    this.eventHandlers.set(event, callback)
    return () => this.eventTarget.removeEventListener(event, callback)
  }

  /**
   * Set a specific value in the meta object of the flow. This allows us to reduce
   * the payload size when sending updates to the client by only sending the updated
   * value instead of the entire meta object.
   *
   * @param key The key of the value to set in the meta object.
   * @param value The value to set in the meta object.
   */
  public setMeta(key: string, value: unknown) {
    this.meta = { ...this.meta, [key]: value }
    this.dispatch('flow:meta', key, value)
  }

  /**
   * Push a node to the flow. The node is instantiated with the given options
   * and added to the flow.
   *
   * @param node The node definition to instantiate the node with.
   * @param options The options to instantiate the node with.
   * @returns The node instance that was added to the flow.
   * @example
   *
   * // Create a flow with an entrypoint and a log node.
   * using flow = createFlow()
   * flow.createNode(Core.nodes.Entrypoint)
   */
  public async add<T extends DataSchema, U extends ResultSchema>(node: Node<string, T, U> | string, options?: NodeInstanceOptions<T, U> ): Promise<NodeInstance<T, U>> {

    // --- If the node is a string, resolve the node using the local `resolveNode` function.
    if (typeof node === 'string') {
      if (!this.resolveNode) throw new Error(`Cannot resolve node "${node}" because the \`resolveNode\` function is not defined`)
      const kind = node
      node = await this.resolveNode(kind)
      if (!node) throw new Error(`The node resolver could not resolve the node "${kind}"`)
    }

    // --- Create the node instance and add it to the flow.
    const instance = createNodeInstance<T, U>(node, {
      ...options,
      flow: this,
      resolveReference: (type, name) => this.resolveReference(this, type, name),
    })

    // --- Bind and return the node instance.
    this.dispatch('node:create', instance as NodeInstance)
    this.bind(instance as NodeInstance)
    return instance
  }

  /**
   * Abort and remove one or more nodes from the flow.
   *
   * @param ids The IDs of the nodes to remove from the flow.
   * @example flow.remove('node-1', 'node-2')
   */
  public remove(...ids: string[]) {
    const nodesToRemove: NodeInstance[] = []
    for (const id of ids) {
      const node = this.nodes.find(node => node.id === id)
      if (!node) throw new Error(`Node instance with ID "${id}" does not exist`)
      nodesToRemove.push(node)
    }
    for (const node of nodesToRemove) {
      node.abort()
      this.nodes = this.nodes.filter(n => n.id !== node.id)
      this.dispatch('node:remove', node)
    }
  }

  /**
   * Given a node ID, get the `Node` that corresponds to the node ID.
   *
   * @param id The node ID to get the socket and node for.
   * @returns The node that corresponds to the node ID.
   */
  public get(id: string): NodeInstance {
    const node = this.nodes.find(node => node.id === id)
    if (!node) throw new Error(`The node with ID "${id}" does not exist`)
    return node
  }

  /**
   * Link the output of a node to the input of another node. When processing
   * the flow, the output of the source node is passed as input to the target
   * node.
   *
   * @param sourceId The ID of the source node.
   * @param sourceKey The key of the source data.
   * @param targetId The ID of the target node.
   * @param targetKey The key of the target data.
   * @example flow.createLink('node-1:output', 'node-2:input')
   */
  public link(sourceId: string, sourceKey: string, targetId: string, targetKey: string): void {
    const targetNode = this.get(targetId)
    const sourceNode = this.get(sourceId)
    const targetSocket = targetNode.dataSchema[targetKey]
    const sourceSocket = sourceNode.resultSchema[sourceKey]

    // --- Verify that the source and target can be linked.
    if (!sourceSocket) throw new Error(`The result property "${sourceKey}" does not exist`)
    if (!targetSocket) throw new Error(`The data property "${targetKey}" does not exist`)
    if (targetSocket.control !== 'socket') throw new Error(`The data property "${targetKey}" cannot be linked to.`)
    if (sourceId === targetId) throw new Error('Cannot link a node to itself')

    // --- If the target socket is not iterable, set the value directly.
    if (!targetSocket.isIterable) {
      const link = this.linkStringify(sourceId, sourceKey)
      targetNode.setDataValue(targetKey, link)
      return
    }

    // --- Otherwise, append the value to the target socket.
    const newValue = this.linkStringify(sourceId, sourceKey)
    const rawValue = targetNode.data[targetKey] ?? []
    const rawValueArray = Array.isArray(rawValue) ? rawValue : [rawValue]
    if (rawValueArray.includes(newValue)) return
    rawValueArray.push(newValue)
    targetNode.setDataValue(targetKey, rawValueArray)
  }

  /**
   * Unlink a node from another node. This removes the link between the source
   * and target node.
   *
   * If the source node is not specified, all links that are connected to the
   * target node are removed. If the target node is not specified, all links
   * that are connected to the source node are removed. Otherwise, only the
   * specific link between the source and target node is removed.
   *
   * @param sourceId The ID of the source node.
   * @param sourceKey The key of the source data.
   * @param targetId The ID of the target node.
   * @param targetKey The key of the target data.
   * @example flow.linkRemove('01234567-89ab-cdef-0123-456789abcdef:socket')
   */
  public unlink(sourceId?: string, sourceKey?: string, targetId?: string, targetKey?: string): void {
    for (const node of this.nodes) {
      if (targetId && node.id !== targetId) continue
      for (const key in node.data) {
        if (targetKey && key !== targetKey) continue
        const value = node.data[key]
        const socket = node.dataSchema[key]

        // --- Filter out the link if the source and target are specified.
        if (socket?.isIterable && Array.isArray(value)) {
          const newValue = value.filter((v: string) => {
            const link = this.linkParse(v)
            if (!link) return true
            if (sourceId && link.sourceId !== sourceId) return true
            if (sourceId && sourceKey && link.sourceKey !== sourceKey) return true
            return false
          })
          node.setDataValue(key, newValue)
        }

        // --- Set the value to `undefined` if the source and target are specified.
        else {
          const link = this.linkParse(value)
          if (!link) continue
          if (sourceId && link.sourceId !== sourceId) continue
          if (sourceId && sourceKey && link.sourceKey !== sourceKey) continue
          node.setDataValue(key, undefined)
        }
      }
    }
  }

  /**
   * Process the flow. The flow is processed by executing the entrypoint
   * with the given input and letting the nodes trigger each other.
   *
   * @param input The input to start the flow with.
   * @returns A promise that resolves when the flow has ended.
   */
  public async start(input: Record<string, unknown> = {}): Promise<ObjectLike> {
    return new Promise<ObjectLike>((resolve, reject) => {

      // --- Avoid starting the flow if the flow is already running.
      if (this.isRunning) {
        const error = new Error('The flow is already running')
        this.dispatch('flow:error', error, this.eventMeta)
        reject(error)
      }

      // --- If the flow is destroyed, reject the promise.
      if (this.isDestroyed) {
        const error = new Error('The flow has been destroyed')
        this.dispatch('flow:error', error, this.eventMeta)
        reject(error)
      }

      // --- (re)Initialize the context and start the flow.
      this.isRunning = true
      this.context = {}
      this.threadId = randomUUID() as string
      this.threadStart = Date.now()
      this.input = input
      this.output = {}

      // --- If the node that ended is connected to other nodes, start the connected nodes.
      const stop = this.on('node:end', (node, data, result) => {
        const links = this.links.filter(link => link.sourceId === node.id)
        for (const { sourceKey, targetId } of links) {
          if (result[sourceKey] === undefined) continue
          void this.get(targetId).start()
        }

        // --- If the node is an output node, apply the result to the flow output.
        if (node.node.kind === NODE_OUTPUT_KIND) {
          this.output[data.name as string] = data.value
          this.dispatch('flow:output', data.name as string, data.value, this.eventMeta)
        }
      })

      // --- Check from time to time if at least one node is still running.
      // --- If not, stop the flow and dispatch the flow:end event.
      const interval = setInterval(() => {
        for (const node of this.nodes) {
          if (node.state === 'RUNNING') return
          if (node.state === 'PROCESSING') return
        }
        this.isRunning = false
        clearInterval(interval)
        stop()
        this.dispatch('flow:end', this.output, this.eventMeta)
        resolve(this.output)
      }, 10)

      // --- Dispatch the flow:start event to notify listeners that the flow has started.
      // --- Start nodes that don't have any incoming links.
      this.dispatch('flow:start', input, this.eventMeta)
      for (const node of this.nodes) {

        // --- Skip the node if it has incoming links.
        const hasIncomingLinks = this.links.some(link => link.targetId === node.id)
        if (hasIncomingLinks) continue

        // --- If the node is an input, apply the input value to the node.
        if (node.node.kind === NODE_INPUT_KIND) {
          const name = node.data.name as string
          const value = input[name]
          node.result = { value }
        }

        // --- Start the node.
        void node.start()
      }
    })
  }

  /**
   * Abort the flow. The flow is aborted by stopping the execution of all nodes
   * in the flow. This is useful when the flow is stuck in an infinite loop or
   * when the flow is no longer needed.
   */
  public abort(): void {
    for (const node of this.nodes) node.abort()
    this.dispatch('flow:abort', this.output, this.eventMeta)
    this.isRunning = false
  }

  /**
   * Destroy the flow. The flow is destroyed by stopping the execution of all
   * nodes in the flow and removing all event listeners. This is useful when the
   * flow is no longer needed and should be cleaned up.
   */
  public destroy(): void {
    this.isDestroyed = true
    for (const node of this.nodes) node.destroy()
    for (const [event, listener] of this.eventHandlers) this.eventTarget.removeEventListener(event, listener)
    this.nodes = []
  }

  public [Symbol.dispose](): void {
    void this.destroy()
  }
}

/**
 * Create a createFlow instance. The flow is a collection of nodes that are
 * linked together. The flow is processed by executing the entrypoint and
 * letting the nodes trigger each other.
 *
 * You can pass a list of modules to the flow. The modules are used to infer
 * the available node kinds that can be added to the flow.
 *
 * @param options The options to create the flow with.
 * @returns The createFlow instance.
 * @example
 *
 * // Create a flow with the core module.
 * using flow = createFlow({ modules: [Core] })
 *
 * // Add nodes from the core module to the flow.
 * flow.add(Core.nodes.Entrypoint)
 * flow.add('nwrx/core:log')
 */
export function createFlow(options?: FlowOptions): Flow {
  return new Flow(options)
}
