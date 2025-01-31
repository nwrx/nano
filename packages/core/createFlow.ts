import type { MaybeLiteral } from '@unshared/types'
import type { NodeEventMeta, NodeInstanceMeta, NodeInstanceOptions } from './createNodeInstance'
import type { DataSchema, DataSocket } from './defineDataSchema'
import type { Module } from './defineModule'
import type { Node } from './defineNode'
import type { ResultSchema, ResultSocket } from './defineResultSchema'
import type { NodeByKind, NodeKind } from './types'
import { randomUUID } from 'node:crypto'
import { nextTick } from 'node:process'
import { createFlowNodeInstance as createNodeInstance, NodeInstance } from './createNodeInstance'

export interface FlowEventMeta {
  threadId: string
  delta: number
  timestamp: number
}

/**
 * A map of events that can be dispatched by a flow node and the parameters
 * that are passed to the event listeners.
 */
export interface FlowEvents {

  // Node
  'node:create': [node: NodeInstance<any, any>]
  'node:meta': [node: NodeInstance<any, any>, NodeInstanceMeta]
  'node:metaValue': [node: NodeInstance<any, any>, key: string, value: unknown]
  'node:data': [node: NodeInstance<any, any>, data: Record<string, unknown>]
  'node:dataRaw': [node: NodeInstance<any, any>, data: Record<string, unknown>]
  'node:dataSchema': [node: NodeInstance<any, any>, schema: DataSchema]
  'node:result': [node: NodeInstance<any, any>, result: Record<string, unknown>]
  'node:resultSchema': [node: NodeInstance<any, any>, schema: ResultSchema]
  'node:position': [node: NodeInstance<any, any>, x: number, y: number]
  'node:remove': [node: NodeInstance<any, any>]

  // Node Lifecycle
  'node:start': [node: NodeInstance<any, any>, data: Record<string, unknown>, meta: NodeEventMeta]
  'node:end': [node: NodeInstance<any, any>, data: Record<string, unknown>, result: Record<string, unknown>, meta: NodeEventMeta]
  'node:abort': [node: NodeInstance<any, any>, meta: NodeEventMeta]
  'node:error': [node: NodeInstance<any, any>, error: Error, meta: NodeEventMeta]

  // Flow
  'flow:meta': [FlowMeta]
  'flow:metaValue': [key: string, value: unknown]
  'flow:input': [name: string, value: unknown, meta: FlowEventMeta]
  'flow:output': [name: string, value: unknown, meta: FlowEventMeta]

  // Flow Lifecycle
  'flow:start': [input: Record<string, unknown>, meta: FlowEventMeta]
  'flow:abort': [output: Record<string, unknown>, meta: FlowEventMeta]
  'flow:end': [output: Record<string, unknown>, meta: FlowEventMeta]
}

/**
 * A listener for a flow node event. The listener is called when the event is
 * dispatched by the flow node.
 */
export type FlowListener<K extends keyof FlowEvents> = (...data: FlowEvents[K]) => void

/**
 * Additional options that can be set for a flow. This includes the name, icon
 * and description or any other settings that are context-specific.
 */
export interface FlowMeta {
  name?: string
  slug?: string
  icon?: string
  description?: string
  [key: string]: unknown
}

/**
 * The settings of a flow. This includes the name, icon and description of the
 * flow that are displayed in the UI. The settings can be updated by calling the
 * `setMeta` method on the flow.
 */
export interface FlowOptions<T extends Module = Module> {
  modules?: T[]
  meta?: FlowMeta
  secrets?: Record<string, string>
  variables?: Record<string, string>
  context?: Record<string, unknown>
}

/**
 * A `Link` represents a link between two nodes in a flow. The link is used
 * to connect the output of one node to the input of another node. This allows
 * the nodes to communicate with each other and pass data between them.
 */
export interface Link {
  source: string
  target: string
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
export class Flow<T extends Module = Module> implements FlowOptions<T> {

  /**
   * Create a createFlow instance. The flow is a collection of nodes that are
   * linked together. The flow is processed by executing the entrypoint and
   * letting the nodes trigger each other.
   *
   * You can pass a list of modules to the flow. The modules are used to infer
   * the available node kinds that can be added to the flow.
   *
   * @param options The options to create the flow with.
   */
  constructor(options: FlowOptions<T> = {}) {
    if (options.meta) this.meta = options.meta
    if (options.modules) this.modules = options.modules
    if (options.secrets) this.secrets = options.secrets
    if (options.variables) this.variables = options.variables
  }

  public meta: FlowMeta = {}
  public modules: T[] = []
  public nodes: NodeInstance[] = []

  public secrets = {} as Record<string, string>
  public context = {} as FlowContext
  public variables = {} as Record<string, string>

  public isRunning = false
  public threadId = randomUUID() as string
  public threadStart = Date.now()

  public eventTarget = new EventTarget()
  public eventHandlers = new Map<string, EventListener>()

  public input = {} as Record<string, unknown>
  public output = {} as Record<string, unknown>

  /**
   * Dispatch an event to the flow. The event is dispatched to all nodes in
   * the flow.
   *
   * @param event The event to dispatch.
   * @param data The data to pass to the event listeners.
   */
  public dispatch<K extends keyof FlowEvents>(event: K, ...data: FlowEvents[K]) {
    const customEvent = new CustomEvent(event as string, { detail: data })
    this.eventTarget.dispatchEvent(customEvent)
  }

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
   * Set the settings of the flow. This includes the name, icon and description of
   * the flow that are displayed in the UI. Once called, an event is dispatched
   * to notify listeners that the settings have been updated.
   *
   * @param meta The settings to set for the flow.
   * @example flow.setMeta({ name: 'Flow', icon: 'flow', description: 'A flow' })
   */
  public setMeta(meta: Partial<FlowMeta>) {
    this.meta = { ...this.meta, ...meta }
    this.dispatch('flow:meta', this.meta)
  }

  /**
   * Set a specific value in the meta object of the flow. This allows us to reduce
   * the payload size when sending updates to the client by only sending the updated
   * value instead of the entire meta object.
   *
   * @param key The key of the value to set in the meta object.
   * @param value The value to set in the meta object.
   */
  public setMetaValue(key: string, value: unknown) {
    this.meta = { ...this.meta, [key]: value }
    this.dispatch('flow:metaValue', key, value)
  }

  /**
   * Given a node kind, get the node definition that corresponds to the node kind.
   * The node definition is used to instantiate the node with the given options.
   *
   * @param kind The kind of the node to get the node definition for.
   * @returns The node definition that corresponds to the node kind.
   */
  public resolveNodeDefinition<K extends NodeKind<T>>(kind: MaybeLiteral<K>): NodeByKind<T, K> {
    const [moduleKind, nodeKind] = kind.split(':')
    const module = this.modules.find(module => module.kind === moduleKind)
    if (!module) throw new Error(`Module "${moduleKind}" was not found`)
    const nodeDefinition = module.nodes?.find(node => node.kind === nodeKind)
    if (!nodeDefinition) throw new Error(`Node definition "${nodeKind}" was not found in module "${moduleKind}"`)
    return nodeDefinition as NodeByKind<T, K>
  }

  /**
   * Given a `Node` or `NodeInstance`, reslove the module from which the node
   * originates.
   *
   * @param node The node definition or instance to get the module for.
   * @returns The module that the node originates from.
   */
  public resolveNodeModule(node: Node | NodeInstance): T {
    const nodeDefinition = node instanceof NodeInstance ? node.node : node
    for (const module of this.modules) {
      if (!module.nodes) continue
      if (module.nodes.includes(nodeDefinition)) return module
    }
    throw new Error(`Module for node "${nodeDefinition.kind}" was not found`)
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
  public createNode<
    T extends DataSchema,
    U extends ResultSchema,
  >(
    node: Node<string, T, U>,
    options?: Omit<NodeInstanceOptions<T, U>, 'flow' | 'node'>,
  ): NodeInstance<T, U> {

    // --- Create the node instance and add it to the flow.
    const instance = createNodeInstance({ ...options, flow: this, node })
    this.nodes.push(instance as NodeInstance)
    this.dispatch('node:create', instance as NodeInstance)
    instance.on('data', data => this.dispatch('node:data', instance, data))
    instance.on('dataRaw', data => this.dispatch('node:dataRaw', instance, data))
    instance.on('dataSchema', schema => this.dispatch('node:dataSchema', instance, schema))
    instance.on('result', result => this.dispatch('node:result', instance, result))
    instance.on('resultSchema', schema => this.dispatch('node:resultSchema', instance, schema))
    instance.on('meta', meta => this.dispatch('node:meta', instance, meta))
    instance.on('metaValue', (key, value) => this.dispatch('node:metaValue', instance, key, value))
    instance.on('start', (data, meta) => this.dispatch('node:start', instance, data, meta))
    instance.on('abort', meta => this.dispatch('node:abort', instance, meta))
    instance.on('end', (data, result, meta) => this.dispatch('node:end', instance, data, result, meta))
    instance.on('error', (error, meta) => this.dispatch('node:error', instance, error, meta))
    return instance
  }

  /**
   * Delete a node from the flow by its ID. The node is removed from the flow
   * and all links to the node are removed. Once called, an event is dispatched
   * to notify listeners that the node has been removed.
   *
   * @param ids The IDs of the nodes to remove from the flow.
   * @example flow.nodeRemove('01234567-89ab-cdef-0123-456789abcdef')
   */
  public removeNode(...ids: string[]) {
    for (const id of ids) {
      this.getNodeInstance(id)
      const node = this.nodes.find(node => node.id === id)
      if (!node) throw new Error(`Node instance with ID "${id}" does not exist`)
      this.nodes = this.nodes.filter(node => node.id !== id)
      this.dispatch('node:remove', node)
    }
  }

  /**
   * Given a node ID, get the `Node` that corresponds to the node ID.
   *
   * @param id The node ID to get the socket and node for.
   * @returns The node that corresponds to the node ID.
   */
  public getNodeInstance(id: string): NodeInstance {
    const nodes = [...this.nodes]
    const node = nodes.find(node => node.id === id)
    if (!node) throw new Error(`Node instance with ID "${id}" does not exist`)
    return node
  }

  /**
   * Given an composite ID, get the `FlowNodeSocket` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the socket separated by a colon.
   *
   * @param compositeId The composite ID to get the socket and node for.
   * @returns The socket that corresponds to the composite ID.
   */
  public getResultSocket(compositeId: string): ResultSocket {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNodeInstance(nodeId)
    return node.getResultSocket(edgeId)
  }

  /**
   * Given an composite ID, get the `FlowNodeSocket` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the socket separated by a colon.
   *
   * @param compositeId The composite ID to get the socket and node for.
   * @returns The socket that corresponds to the composite ID.
   */
  public getDataSocket(compositeId: string): DataSocket {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNodeInstance(nodeId)
    return node.getDataSocket(edgeId)
  }

  /**
   * Traverse all nodes in the flow and return the links that connect the nodes
   * together. The links are used to connect the output of one node to the input
   * of another node.
   *
   * @returns An array of links that connect the nodes together.
   */
  get links(): Link[] {
    const links: Link[] = []
    for (const node of this.nodes) {
      for (const edge in node.dataRaw) {
        const value = node.dataRaw[edge]
        if (typeof value !== 'string') continue
        if (!value.startsWith('$NODE.')) continue
        const target = `${node.id}:${edge}`
        const source = value.replace('$NODE.', '')
        links.push({ source, target })
      }
    }
    return links
  }

  /**
   * Link the output of a node to the input of another node. When processing
   * the flow, the output of the source node is passed as input to the target
   * node.
   *
   * @param source The ID of the source node.
   * @param target The ID of the target node.
   * @example flow.createLink('nwrx/core:entrypoint', 'nwrx/core:log')
   */
  public createLink(source: string, target: string): void {

    // --- Resolve the source and target socket.
    const [sourceNodeId, sourceSocketId] = source.split(':')
    const [targetNodeId, targetSocketId] = target.split(':')
    const sourceSocket = this.getResultSocket(source)
    const targetSocket = this.getDataSocket(target)

    // --- Check if the nodes can be linked.
    if (sourceNodeId === targetNodeId)
      throw new Error('Cannot link the node to itself')
    if (sourceSocket.type.kind !== targetSocket.type.kind)
      throw new Error(`Cannot link ${sourceSocket.type.name} to ${targetSocket.type.name}`)

    // --- If the target is already linked and it's `isArray` flag is false, remove the link.
    if (!targetSocket.isArray)
      this.removeLink(target)

    // --- Create the link and dispatch the event.
    const nodeTarget = this.getNodeInstance(targetNodeId)
    nodeTarget.setDataValue(targetSocketId, `$NODE.${sourceNodeId}:${sourceSocketId}`)
  }

  /**
   * Unlink a node socket from all other nodes.
   *
   * @param socket The node ID and socket ID of which to remove the link.
   * @example flow.linkRemove('01234567-89ab-cdef-0123-456789abcdef:socket')
   */
  public removeLink(socket: string): void {

    // --- Find the node that contains the socket.
    const [nodeId, socketId] = socket.split(':')
    const node = this.getNodeInstance(nodeId)
    const isDataSocket = socketId in node.dataSchema

    // --- If the socket is a data socket, remove the link from the data socket.
    if (isDataSocket) {
      node.setDataValue(socketId, undefined)
    }

    // --- If the socket is a result socket, remove all links that are connected to the result socket.
    else {
      for (const targetNode of this.nodes) {
        for (const targetSocket in targetNode.dataRaw) {
          if (targetNode.dataRaw[targetSocket] === `$NODE.${nodeId}:${socketId}`)
            targetNode.setDataValue(targetSocket, undefined)
        }
      }
    }
  }

  /**
   * Compute the `FlowEventMeta` for the flow. The meta is used to provide
   * additional information about the flow when an event is dispatched.
   * The meta includes the thread ID, the delta time, the duration and the
   * timestamp of the flow.
   *
   * @returns The `FlowEventMeta` for the flow.
   */
  private get eventMeta(): FlowEventMeta {
    return {
      threadId: this.threadId,
      delta: Date.now() - this.threadStart,
      timestamp: Date.now(),
    }
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
   * Process the flow. The flow is processed by executing the entrypoint
   * with the given input and letting the nodes trigger each other.
   *
   * @param input The input to start the flow with.
   */
  public start(input: Record<string, unknown> = {}): void {
    if (this.isRunning) return
    this.isRunning = true

    // --- Reset the flow and set the input.
    this.context = {}
    this.threadId = randomUUID() as string
    this.threadStart = Date.now()
    this.input = input
    this.output = {}
    for (const node of this.nodes) {
      node.isDone = false
      node.result = {}
    }

    // --- Start listening for node result events.
    const stop = this.on('node:end', (node, data, result) => {

      // --- Handle links that are connected to the node.
      const links = this.links.filter(link => link.source.startsWith(node.id))
      for (const { source, target } of links) {
        const [node] = target.split(':')
        const [, key] = source.split(':')
        if (result[key] === undefined) continue
        const targetNode = this.getNodeInstance(node)
        void targetNode.process()
      }

      // --- If the node is `nwrx/core:output`, set the output of the flow.
      if (node.kind === 'nwrx/core:output') {
        this.output[data.name as string] = data.value
        this.dispatch('flow:output', data.name as string, data.value, this.eventMeta)
      }
    })

    // --- When the `input` nodes are started, dispatch the `flow:input` event.
    const stopInput = this.on('node:start', (node, data) => {
      if (node.kind !== 'nwrx/core:input') return
      const name = data.name as string
      const value = input[name]
      nextTick(() => this.dispatch('flow:input', name, value, this.eventMeta))
    })

    // --- Check from time to time if at least one node is still running.
    // --- If not, stop the flow and dispatch the flow:end event.
    const interval = setInterval(() => {
      for (const node of this.nodes) if (node.isRunning) return
      this.isRunning = false
      clearInterval(interval)
      stop()
      stopInput()
      this.dispatch('flow:end', this.output, this.eventMeta)
    }, 100)

    // --- Dispatch the flow:start event to notify listeners that the flow has started.
    this.dispatch('flow:start', input, this.eventMeta)

    // --- Start nodes that don't have any incoming links.
    this.nodes
      .filter(node => !this.links.some(link => link.target.startsWith(node.id)))
      .forEach(node => void node.process())
  }

  /**
   * Destroy the flow. The flow is destroyed by stopping the execution of all
   * nodes in the flow and removing all event listeners. This is useful when the
   * flow is no longer needed and should be cleaned up.
   */
  destroy(): void {
    this.abort()
    for (const node of this.nodes) node[Symbol.dispose]()
    for (const [event, listener] of this.eventHandlers) this.eventTarget.removeEventListener(event, listener)
    // @ts-expect-error: Dereferencing the array.
    this.nodes = undefined
    // @ts-expect-error: Dereferencing the array.
    this.modules = undefined
  }

  [Symbol.dispose](): void {
    this.destroy()
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
 * flow.nodeCreate(Core.nodes.Entrypoint)
 * flow.nodeCreate('nwrx/core:log')
 */
export function createFlow<T extends Module>(options?: FlowOptions<T>): Flow<T> {
  return new Flow<T>(options)
}
