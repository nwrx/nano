import type { FlowNodeInstanceMeta, FlowNodeInstanceOptions } from './createFlowNodeInstance'
import type { FlowModule } from './defineFlowModule'
import type { FlowNode, FlowNodePort, FlowSchema } from './defineFlowNode'
import type { InferNodeByKind, InferNodeKind } from './types'
import { createFlowNodeInstance, FlowNodeInstance } from './createFlowNodeInstance'

/**
 * A map of events that can be dispatched by a flow node and the parameters
 * that are passed to the event listeners.
 */
export interface FlowEvents {

  // Node
  'node:create': [FlowNodeInstance]
  'node:meta': [id: string, FlowNodeInstanceMeta]
  'node:metaValue': [id: string, key: string, value: unknown]
  'node:data': [id: string, data: Record<string, unknown>]
  'node:dataSchema': [id: string, schema: FlowSchema]
  'node:result': [id: string, result: Record<string, unknown>]
  'node:resultSchema': [id: string, schema: FlowSchema]
  'node:position': [id: string, x: number, y: number]
  'node:remove': [id: string]
  'node:error': [id: string, error: Error]
  'node:start': [id: string]
  'node:end': [id: string]
  'node:abort': [id: string]

  // Links
  'link:create': [{ source: string; target: string }]
  'link:remove': [{ source: string; target: string }]

  // Flow
  'flow:start': []
  'flow:meta': [FlowMeta]
  'flow:metaValue': [key: string, value: unknown]
  'flow:input': [property: string, value: unknown]
  'flow:output': [property: string, value: unknown]
  'flow:abort': []
  'flow:end': []
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
export interface FlowOptions<T extends FlowModule = FlowModule> {
  modules?: T[]
  meta?: FlowMeta
}

/**
 * A `FlowLink` represents a link between two nodes in a flow. The link is used
 * to connect the output of one node to the input of another node. This allows
 * the nodes to communicate with each other and pass data between them.
 */
export interface FlowLink {
  source: string
  target: string
}

/**
 * a `Flow` is a collection of `FlowNode`s that are linked together. The flow
 * is processed by executing the entrypoint and letting the nodes trigger each
 * other.
 *
 * The flow also provides a way to dispatch and listen for events that are
 * triggered by changes in the flow.
 */
export class Flow<T extends FlowModule = FlowModule> implements FlowOptions<T> {

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
  }

  public meta: FlowMeta = {}
  public modules: T[] = []
  public links: FlowLink[] = []
  public nodes: FlowNodeInstance[] = []
  public isRunning = false
  public eventTarget = new EventTarget()
  public eventHandlers = new Map<string, EventListener>()

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
  public resolveNodeDefinition<K extends InferNodeKind<T>>(kind: K): InferNodeByKind<T, K> {
    const [moduleKind, nodeKind] = kind.split(':')
    const module = this.modules.find(module => module.kind === moduleKind)
    if (!module) throw new Error(`Module "${moduleKind}" was not found`)
    const nodeDefinition = module.nodes?.find(node => node.kind === nodeKind) as FlowNode<string, any, any>
    if (!nodeDefinition) throw new Error(`Node definition "${nodeKind}" was not found in module "${moduleKind}"`)
    return nodeDefinition as InferNodeByKind<T, K>
  }

  /**
   * Given a `FlowNode` or `FlowNodeInstance`, reslove the module from which the node
   * originates.
   *
   * @param node The node definition or instance to get the module for.
   * @returns The module that the node originates from.
   */
  public resolveNodeModule(node: FlowNode | FlowNodeInstance): T {
    const nodeDefinition = node instanceof FlowNodeInstance ? node.node : node
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
   * @example
   *
   * // Create a flow with an entrypoint and a log node.
   * using flow = createFlow()
   * flow.nodeCreate(Core.nodes.Entrypoint)
   * flow.nodeCreate(Core.nodes.Log)
   */
  public async nodeCreate<T extends FlowNode<string, any, any>>(node: T, options?: Omit<FlowNodeInstanceOptions<T>, 'flow' | 'node'>): Promise<FlowNodeInstance<T>>
  public async nodeCreate<K extends InferNodeKind<T>>(node: K, options?: Omit<FlowNodeInstanceOptions<InferNodeByKind<T, K>>, 'flow' | 'node'>): Promise<FlowNodeInstance<InferNodeByKind<T, K>>>
  public async nodeCreate(node: FlowNode | string, options?: Omit<FlowNodeInstanceOptions, 'flow' | 'node'>): Promise<FlowNodeInstance>
  public async nodeCreate(node: FlowNode | string, options: Omit<FlowNodeInstanceOptions, 'flow' | 'node'> = {}) {

    // --- If the node is a string, get the node from the modules.
    if (typeof node === 'string') node = this.resolveNodeDefinition(node as InferNodeKind<T>)

    // --- Create the node instance and add it to the flow.
    const instance = createFlowNodeInstance({ ...options, flow: this, node })
    this.nodes.push(instance)
    await instance.resolveDataSchema()
    await instance.resolveResultSchema()
    this.dispatch('node:create', instance)
    instance.on('data', data => this.dispatch('node:data', instance.id, data))
    instance.on('result', result => this.dispatch('node:result', instance.id, result))
    instance.on('dataSchema', schema => this.dispatch('node:dataSchema', instance.id, schema))
    instance.on('resultSchema', schema => this.dispatch('node:resultSchema', instance.id, schema))
    instance.on('start', () => this.dispatch('node:start', instance.id))
    instance.on('meta', meta => this.dispatch('node:meta', instance.id, meta))
    instance.on('metaValue', (key, value) => this.dispatch('node:metaValue', instance.id, key, value))
    instance.on('error', error => this.dispatch('node:error', instance.id, error))
    instance.on('abort', () => this.dispatch('node:abort', instance.id))
    instance.on('end', () => this.dispatch('node:end', instance.id))
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
  public nodeRemove(...ids: string[]) {
    for (const id of ids) {
      this.getNodeInstance(id)
      this.nodes = this.nodes.filter(node => node.id !== id)
      this.linkRemove(id)
      this.dispatch('node:remove', id)
    }
  }

  /**
   * Given a node ID, get the `FlowNode` that corresponds to the node ID.
   *
   * @param id The node ID to get the port and node for.
   * @returns The node that corresponds to the node ID.
   */
  public getNodeInstance(id: string): FlowNodeInstance {
    const nodes = [...this.nodes]
    const node = nodes.find(node => node.id === id)
    if (!node) throw new Error(`Node instance with ID "${id}" does not exist`)
    return node
  }

  /**
   * Given an composite ID, get the `FlowNodePort` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the port separated by a colon.
   *
   * @param compositeId The composite ID to get the port and node for.
   * @returns The port that corresponds to the composite ID.
   */
  public getResultPort(compositeId: string): FlowNodePort {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNodeInstance(nodeId)
    return node.getResultPort(edgeId)
  }

  /**
   * Given an composite ID, get the `FlowNodePort` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the port separated by a colon.
   *
   * @param compositeId The composite ID to get the port and node for.
   * @returns The port that corresponds to the composite ID.
   */
  public getDataPort(compositeId: string): FlowNodePort {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNodeInstance(nodeId)
    return node.getDataPort(edgeId)
  }

  /**
   * Link the output of a node to the input of another node. When processing
   * the flow, the output of the source node is passed as input to the target
   * node.
   *
   * @param source The ID of the source node.
   * @param target The ID of the target node.
   * @example flow.linkCreate('nwrx/core:entrypoint', 'nwrx/core:log')
   */
  public linkCreate(source: string, target: string): void {

    // --- Resolve the source and target ports.
    const [sourceNodeId] = source.split(':')
    const [targetNodeId] = target.split(':')
    const sourceNode = this.getResultPort(source)
    const targetNode = this.getDataPort(target)

    // --- Check if the nodes can be linked.
    if (sourceNodeId === targetNodeId)
      throw new Error('Cannot link the node to itself')
    if (sourceNode.type.kind !== targetNode.type.kind)
      throw new Error(`Cannot link ${sourceNode.type.name} to ${targetNode.type.name}`)

    // --- If the target is already linked, remove the link.
    const existingLink = this.links.find(link => link.target === target)
    if (existingLink) this.linkRemove(existingLink.source, existingLink.target)

    // --- Create the link and dispatch the event.
    this.links.push({ source, target })
    this.dispatch('link:create', { source, target })
  }

  /**
   * Unlink the output of a node from the input of another node.
   *
   * @param source The ID of the port that is the source of the link.
   * @param target The ID of the port that is the target of the link. (optional)
   */
  public linkRemove(source: string, target?: string): void {
    for (const link of this.links) {

      // --- If the target is not specified, remove all links that are connected
      // --- to this specific source port, whether they are the source or target.
      if (!target && link.source === source || link.target === source) {
        this.links = this.links.filter(link => link.source !== source && link.target !== source)
        this.dispatch('link:remove', link)
        continue
      }

      // --- If the source and target are specified, remove the link that connects
      // --- the source and target ports together.
      else if (link.source === source && link.target === target) {
        this.links = this.links.filter(link => link.source !== source && link.target !== target)
        this.dispatch('link:remove', link)
        continue
      }
    }
  }

  /**
   * Abort the flow. The flow is aborted by stopping the execution of all nodes
   * in the flow. This is useful when the flow is stuck in an infinite loop or
   * when the flow is no longer needed.
   */
  public abort(): void {
    for (const node of this.nodes) node.abort()
    this.dispatch('flow:abort')
    this.isRunning = false
  }

  /**
   * Process the flow. The flow is processed by executing the entrypoint
   * with the given input and letting the nodes trigger each other.
   */
  public run(): void {
    if (this.isRunning) return
    this.isRunning = true

    // --- Start listening for node result events. Each time a node result is set,
    // --- we start searching for the target nodes that are linked to the source node
    // --- and send then the result of the source node.
    const stop = this.on('node:result', (id, result) => {
      const targetLinks = this.links.filter(link => link.source.startsWith(id))
      for (const { source, target } of targetLinks) {
        const [targetId, targetKey] = target.split(':')
        const targetNode = this.getNodeInstance(targetId)
        const [, sourceKey] = source.split(':')
        void targetNode.setDataValue(targetKey, result[sourceKey])
      }
    })

    // --- When all nodes are done, we stop the flow and remove the listener.
    const nodesIdsToTrack = new Set(this.nodes.map(node => node.id))
    const stopAll = this.on('node:end', (id) => {
      nodesIdsToTrack.delete(id)
      if (nodesIdsToTrack.size === 0) {
        this.isRunning = false
        stop()
        stopAll()
        this.dispatch('flow:end')
      }
    })

    // --- Start all nodes that are part of the flow
    // --- and that have have either an incoming link or are the entrypoint.
    for (const node of this.nodes) void node.start()

    // --- Start the flow by dispatching the start event.
    this.dispatch('flow:start')
  }

  /**
   * Dispose of the flow. The flow is disposed by removing all nodes and links
   * from the flow and stopping the execution of all nodes. Once disposed, the
   * flow can no longer be used.
   */
  [Symbol.dispose](): void {
    this.abort()
    for (const node of this.nodes) node[Symbol.dispose]()
    for (const [event, listener] of this.eventHandlers) this.eventTarget.removeEventListener(event, listener)
    // @ts-expect-error: Dereferencing the array.
    this.nodes = undefined
    // @ts-expect-error: Dereferencing the array.
    this.links = undefined
    // @ts-expect-error: Dereferencing the array.
    this.modules = undefined
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
export function createFlow<T extends FlowModule>(options?: FlowOptions<T>): Flow<T> {
  return new Flow<T>(options)
}

/* v8 ignore start */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {
  const { defineFlowNode } = await import('./defineFlowNode')
  const { moduleCore, nodeJsonParse, typeNumber } = await import('./__fixtures__')

  describe('constructor', () => {
    it('should create a flow with no modules', () => {
      using flow = createFlow()
      expect(flow).toMatchObject({
        meta: {},
        nodes: [],
        links: [],
        modules: [],
        eventTarget: expect.any(EventTarget),
      })
    })

    it('should create a flow with specified meta properties', () => {
      using flow = createFlow({ meta: { name: 'Flow', icon: 'flow', description: 'A flow' } })
      expect(flow).toMatchObject({
        meta: { name: 'Flow', icon: 'flow', description: 'A flow' },
        nodes: [],
        links: [],
        modules: [],
        eventTarget: expect.any(EventTarget),
      })
    })

    it('should create a flow with specified modules', () => {
      using flow = createFlow({ modules: [moduleCore] })
      expect(flow.modules).toStrictEqual([moduleCore])
    })
  })

  describe('eventTarget', () => {
    it('should dispatch an event and call the listener', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('node:data', listener)
      flow.dispatch('node:data', 'node-id', { string: 'Hello, World!' } )
      expect(listener).toHaveBeenCalledWith('node-id', { string: 'Hello, World!' })
    })

    it('should remove the listener when calling the return value of on', () => {
      using flow = createFlow()
      const listener = vi.fn()
      const removeListener = flow.on('node:data', listener)
      removeListener()
      flow.dispatch('node:data', 'node-id', { string: 'Hello, World!' } )
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('setMeta', () => {
    it('should set the settings of the flow', () => {
      using flow = createFlow()
      flow.setMeta({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
      })
      expect(flow.meta).toMatchObject({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
      })
    })

    it('should merge the settings with the existing settings', () => {
      using flow = createFlow({ meta: { name: 'Flow', icon: undefined, description: 'A flow' } })
      flow.setMeta({ name: 'New Flow', icon: 'flow' })
      expect(flow.meta).toMatchObject({
        name: 'New Flow',
        icon: 'flow',
        description: 'A flow',
      })
    })

    it('should set a single value in the meta object', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      flow.setMetaValue('icon', 'flow')
      expect(flow.meta).toMatchObject({ name: 'Flow', icon: 'flow' })
    })

    it('should emit the "flow:meta" event when the settings are set', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.setMeta({ name: 'Flow', icon: 'flow', description: 'A flow' })
      expect(listener).toHaveBeenCalledWith({ name: 'Flow', icon: 'flow', description: 'A flow' })
    })

    it('should emit the entire meta object when partially updated', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      const listener = vi.fn()
      flow.on('flow:meta', listener)
      flow.setMeta({ icon: 'flow' })
      expect(listener).toHaveBeenCalledWith({ name: 'Flow', icon: 'flow' })
    })

    it('should emit the "flow:metaValue" event when a single value is set', () => {
      using flow = createFlow({ meta: { name: 'Flow' } })
      const listener = vi.fn()
      flow.on('flow:metaValue', listener)
      flow.setMetaValue('icon', 'flow')
      expect(listener).toHaveBeenCalledWith('icon', 'flow')
    })
  })

  describe('resolveNodeDefinition', () => {
    it('should get the node definition given a node kind', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = flow.resolveNodeDefinition('nwrx/core:json-parse')
      expect(node).toStrictEqual(nodeJsonParse)
    })

    it('should throw an error if the node kind is not found', () => {
      using flow = createFlow({ modules: [moduleCore] })
      // @ts-expect-error: Test invalid node kind
      const shouldThrow = () => flow.resolveNodeDefinition('nwrx/core:unknown')
      expect(shouldThrow).toThrow('Node definition "unknown" was not found in module "nwrx/core"')
    })

    it('should throw an error if the module is not found', () => {
      using flow = createFlow({ modules: [moduleCore] })
      // @ts-expect-error: Test invalid module kind
      const shouldThrow = () => flow.resolveNodeDefinition('unknown:unknown')
      expect(shouldThrow).toThrow('Module "unknown" was not found')
    })
  })

  describe('resolveNodeModule', () => {
    it('should get the module of a node definition', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const module = flow.resolveNodeModule(nodeJsonParse)
      expect(module).toStrictEqual(moduleCore)
    })

    it('should get the module of a node instance', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = createFlowNodeInstance({ flow, node: nodeJsonParse })
      const module = flow.resolveNodeModule(node)
      expect(module).toStrictEqual(moduleCore)
    })

    it('should throw an error if the module is not found', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = { ...nodeJsonParse, kind: 'unknown:unknown' }
      const shouldThrow = () => flow.resolveNodeModule(node)
      expect(shouldThrow).toThrow('Module for node "unknown:unknown" was not found')
    })
  })

  describe('nodeCreate', () => {
    it('should create a node instance given a node definition', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      await flow.nodeCreate(nodeJsonParse)
      expect(flow.nodes).toHaveLength(1)
      expect(flow.nodes[0].node).toStrictEqual(nodeJsonParse)
    })

    it('should create a node instance given a node definition and meta', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      await flow.nodeCreate(moduleCore.nodes![0], { meta: { label: 'Node' } })
      expect(flow.nodes).toHaveLength(1)
      expect(flow.nodes[0]).toMatchObject({ meta: { label: 'Node' } })
    })

    it('should create a node with a node kind', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      await flow.nodeCreate('nwrx/core:json-parse')
      expect(flow.nodes).toHaveLength(1)
      expect(flow.nodes[0].node).toStrictEqual(nodeJsonParse)
    })

    it('should create a node with a node kind and meta', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      await flow.nodeCreate('nwrx/core:json-parse', { meta: { label: 'Node' } })
      expect(flow.nodes).toHaveLength(1)
      expect(flow.nodes[0]).toMatchObject({ meta: { label: 'Node' } })
    })

    it('should create a node instance with the given ID', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      await flow.nodeCreate('nwrx/core:json-parse', { id: 'node-id' })
      expect(flow.nodes[0].id).toBe('node-id')
    })

    it('should emit a node:create event', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const listener = vi.fn()
      flow.on('node:create', listener)
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      expect(listener).toHaveBeenCalledWith(node)
    })

    it('should resolve the data schema of the node when created', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate(defineFlowNode({
        kind: 'nwrx/core:json-parse',
        defineDataSchema: () => ({
          number: { name: 'Number', type: typeNumber },
        }),
      }))
      expect(node.dataSchema).toStrictEqual({
        number: { name: 'Number', type: typeNumber },
      })
    })

    it('should resolve the result schema of the node when created', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate(defineFlowNode({
        kind: 'nwrx/core:boolean-to-number',
        defineResultSchema: () => ({
          boolean: { name: 'Boolean', type: typeNumber },
        }),
      }))
      expect(node.resultSchema).toStrictEqual({
        boolean: { name: 'Boolean', type: typeNumber },
      })
    })

    it('should not emit the "node:dataSchema" event when created', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const listener = vi.fn()
      flow.on('node:dataSchema', listener)
      await flow.nodeCreate('nwrx/core:json-parse')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should not emit the "node:resultSchema" event when created', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const listener = vi.fn()
      flow.on('node:resultSchema', listener)
      await flow.nodeCreate('nwrx/core:json-parse')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should throw an error if the node kind is not found', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const shouldReject = flow.nodeCreate('nwrx/core:unknown')
      await expect(shouldReject).rejects.toThrow('Node definition "unknown" was not found in module "nwrx/core"')
    })

    it('should throw an error if the module is not found', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const shouldReject = flow.nodeCreate('unknown:unknown')
      await expect(shouldReject).rejects.toThrow('Module "unknown" was not found')
    })

    it('should emit a node:data event when the data of a node is set', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('node:data', listener)
      await node.setDataValue('json', '{"key": "value"}')
      expect(listener).toHaveBeenCalledWith(node.id, { json: '{"key": "value"}' })
    })

    it('should emit a node:result event when the result of a node is set', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('node:result', listener)
      node.setResultValue('object', { key: 'value' })
      expect(listener).toHaveBeenCalledWith(node.id, { object: { key: 'value' } })
    })

    it('should emit a node:dataSchema event when the data schema of a node is resolved', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('node:dataSchema', listener)
      await node.resolveDataSchema(true)
      expect(listener).toHaveBeenCalledWith(node.id, node.dataSchema)
    })

    it('should emit a node:resultSchema event when the result schema of a node is resolved', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('node:resultSchema', listener)
      await node.resolveResultSchema(true)
      expect(listener).toHaveBeenCalledWith(node.id, node.resultSchema)
    })
  })

  describe('nodeRemove', () => {
    it('should remove a node from the flow', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      flow.nodeRemove(node.id)
      expect(flow.nodes).toHaveLength(0)
    })

    it('should emit a node:remove event', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('node:remove', listener)
      flow.nodeRemove(node.id)
      expect(listener).toHaveBeenCalledWith(node.id)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.nodeRemove('node-id')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('getNodeInstance', () => {
    it('should get a node instance given an ID', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const instance = flow.getNodeInstance(node.id)
      expect(instance).toBe(node)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.getNodeInstance('node-id')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('getDataPort', () => {
    it('should get the data port of a node given a composite ID', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const port = flow.getDataPort(`${node.id}:json`)
      expect(port).toBe(node.dataSchema?.json)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.getDataPort('node-id:string')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('getResultPort', () => {
    it('should get the result port of a node given a composite ID', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const port = flow.getResultPort(`${node.id}:object`)
      expect(port).toBe(node.resultSchema?.object)
    })

    it('should throw an error if the node does not exist', () => {
      using flow = createFlow()
      const shouldThrow = () => flow.getResultPort('node-id:boolean')
      expect(shouldThrow).toThrow('Node instance with ID "node-id" does not exist')
    })
  })

  describe('linkCreate', () => {
    it('should link the output of a node to the input of another node', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:json-parse')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      expect(flow.links).toStrictEqual([{ source: `${node1.id}:value`, target: `${node2.id}:json` }])
    })

    it('should emit a link:create event', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('link:create', listener)
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      expect(listener).toHaveBeenCalledWith({ source: `${node1.id}:value`, target: `${node2.id}:json` })
    })

    it('should remove the existing link if the target is already linked to another source', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:input')
      const node3 = await flow.nodeCreate('nwrx/core:json-parse')
      flow.linkCreate(`${node1.id}:value`, `${node3.id}:json`)
      flow.linkCreate(`${node2.id}:value`, `${node3.id}:json`)
      expect(flow.links).toStrictEqual([{ source: `${node2.id}:value`, target: `${node3.id}:json` }])
    })

    it('should emit a link:remove event if the target is already linked to another source', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:input')
      const node3 = await flow.nodeCreate('nwrx/core:json-parse')
      const listener = vi.fn()
      flow.on('link:remove', listener)
      flow.linkCreate(`${node1.id}:value`, `${node3.id}:json`)
      flow.linkCreate(`${node2.id}:value`, `${node3.id}:json`)
      expect(listener).toHaveBeenCalledWith({ source: `${node1.id}:value`, target: `${node3.id}:json` })
    })

    it('should throw an error if the source and target are the same', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const shouldThrow = () => flow.linkCreate(`${node.id}:object`, `${node.id}:json`)
      expect(shouldThrow).toThrow('Cannot link the node to itself')
    })

    it('should throw an error if the source and target are of different types', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:json-parse')
      const node2 = await flow.nodeCreate('nwrx/core:output')
      const shouldThrow = () => flow.linkCreate(`${node1.id}:object`, `${node2.id}:value`)
      expect(shouldThrow).toThrow('Cannot link Object to String')
    })

    it('should throw an error if the source does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const shouldThrow = () => flow.linkCreate('unknown:boolean', `${node.id}:string`)
      expect(shouldThrow).toThrow('Node instance with ID "unknown" does not exist')
    })

    it('should throw an error if the port of the source does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const shouldThrow = () => flow.linkCreate(`${node.id}:unknown`, `${node.id}:string`)
      expect(shouldThrow).toThrow(/The result schema of node "[\da-z\-]+" does not contain a port with the key "unknown"/)
    })

    it('should throw an error if the target does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node = await flow.nodeCreate('nwrx/core:json-parse')
      const shouldThrow = () => flow.linkCreate(`${node.id}:object`, 'unknown:string')
      expect(shouldThrow).toThrow('Node instance with ID "unknown" does not exist')
    })

    it('should throw an error if the port of the target does not exist', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:json-parse')
      const node2 = await flow.nodeCreate('nwrx/core:output')
      const shouldThrow = () => flow.linkCreate(`${node1.id}:object`, `${node2.id}:unknown`)
      expect(shouldThrow).toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "unknown"/)
    })
  })

  describe('linkRemove', () => {
    it('should remove a link between two nodes', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:json-parse')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      flow.linkRemove(`${node1.id}:value`, `${node2.id}:json`)
      expect(flow.links).toHaveLength(0)
    })

    it('should emit a link:remove event', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:json-parse')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      const listener = vi.fn()
      flow.on('link:remove', listener)
      flow.linkRemove(`${node1.id}:value`, `${node2.id}:json`)
      expect(listener).toHaveBeenCalledWith({ source: `${node1.id}:value`, target: `${node2.id}:json` })
    })

    it('should remove all links from a node port if the target is not specified', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:json-parse')
      const node3 = await flow.nodeCreate('nwrx/core:json-parse')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      flow.linkCreate(`${node1.id}:value`, `${node3.id}:json`)
      flow.linkRemove(`${node1.id}:value`)
      expect(flow.links).toHaveLength(0)
    })

    it('should emit a link:remove event for each link removed', async() => {
      using flow = createFlow({ modules: [moduleCore] })
      const node1 = await flow.nodeCreate('nwrx/core:input')
      const node2 = await flow.nodeCreate('nwrx/core:json-parse')
      const node3 = await flow.nodeCreate('nwrx/core:json-parse')
      flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
      flow.linkCreate(`${node1.id}:value`, `${node3.id}:json`)
      const listener = vi.fn()
      flow.on('link:remove', listener)
      flow.linkRemove(`${node1.id}:value`)
      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenCalledWith({ source: `${node1.id}:value`, target: `${node2.id}:json` })
      expect(listener).toHaveBeenCalledWith({ source: `${node1.id}:value`, target: `${node3.id}:json` })
    })
  })

  describe('run', () => {
    it('should emit the "flow:start" event', () => {
      using flow = createFlow()
      const listener = vi.fn()
      flow.on('flow:start', listener)
      flow.run()
      expect(listener).toHaveBeenCalledOnce()
    })

    // it('should start the execution of the flow', async() => {
    //   using flow = createFlow({ modules: [moduleCore] })

    //   const node1 = await flow.nodeCreate('nwrx/core:input', {
    //     initialData: { property: 'value' },
    //   })

    //   const node2 = await flow.nodeCreate('nwrx/core:json-parse')
    //   flow.linkCreate(`${node1.id}:value`, `${node2.id}:json`)
    //   flow.run()
    //   expect(node1.result).toStrictEqual({ value: undefined })
    // })
  })

  describe('abort', () => {
    it('should abort the flow', () => {
      using flow = createFlow({ modules: [moduleCore] })
      flow.abort()
      expect(flow.isRunning).toBe(false)
    })

    it('should emit the "flow:abort" event', () => {
      using flow = createFlow({ modules: [moduleCore] })
      const listener = vi.fn()
      flow.on('flow:abort', listener)
      flow.abort()
      expect(listener).toHaveBeenCalledOnce()
    })
  })
}
