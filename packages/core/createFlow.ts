import type { FlowNodeInstance, FlowNodeInstanceJSON, FlowNodeInstanceOptions } from './createFlowNodeInstance'
import type { FlowModule } from './defineFlowModule'
import type { FlowNode, FlowNodePort, FlowSchema } from './defineFlowNode'
import type { InferNodeByKind, InferNodeKind } from './types'
import { randomUUID } from 'node:crypto'
import { createFlowNodeInstance } from './createFlowNodeInstance'

/**
 * A map of events that can be dispatched by a flow node and the parameters
 * that are passed to the event listeners.
 */
interface FlowEvents {

  // Link
  'link:create': { source: string; target: string }
  'link:remove': { source: string; target: string }

  // Node
  'node:create': FlowNodeInstanceJSON
  'node:data': { id: string; data: Record<string, unknown> }
  'node:dataValue': { id: string; portId: string; value: unknown }
  'node:dataSchema': { id: string; schema: FlowSchema }
  'node:result': { id: string; result: Record<string, unknown> }
  'node:resultSchema': { id: string; schema: FlowSchema }
  'node:move': { id: string; x: number; y: number }
  'node:remove': { id: string }
  'node:refresh': FlowNodeInstanceJSON

  // Links
  // 'update:links': [link: Record<string, string>]
  // 'update:settings': [settings: FlowSettings]

  // Flow
  // 'flow:start': [data: Record<string, unknown>]
  // 'flow:end': []
  // 'flow:result': [data: Record<string, unknown>]
  'flow:input': { property: string; value: unknown }
  'flow:output': { property: string; value: unknown }
  'flow:update': FlowSettings

  event: { event: string; data: unknown }
  error: Error
}

/**
 * A listener for a flow node event. The listener is called when the event is
 * dispatched by the flow node.
 */
type FlowListener<K extends keyof FlowEvents> = (payload: FlowEvents[K]) => void

/**
 * The settings of a flow. This includes the name, icon and description of the
 * flow that are displayed in the UI. The settings can be updated by calling the
 * `setSettings` method on the flow.
 */
export interface FlowSettings {
  name: string
  icon: string
  description: string
}

/**
 * The JSON representation of a flow. The JSON representation can be used to
 * serialize the flow to a string or to send the flow over the network.
 */
export interface FlowJSON {
  id: string
  name: string
  icon: string
  description: string
  nodes: FlowNodeInstanceJSON[]
  links: Record<string, string>
}

/**
 * a `Flow` is a collection of `FlowNode`s that are linked together. The flow
 * is processed by executing the entrypoint and letting the nodes trigger each
 * other.
 *
 * The flow also provides a way to dispatch and listen for events that are
 * triggered by changes in the flow.
 */
export class Flow<T extends FlowModule = FlowModule> implements FlowSettings {

  /**
   * Create a new flow instance. The flow is a collection of nodes that are
   * linked together. The flow is processed by executing the entrypoint and
   * letting the nodes trigger each other.
   *
   * You can pass a list of modules to the flow. The modules are used to infer
   * the available node kinds that can be added to the flow.
   *
   * @param modules The modules to add to the flow.
   */
  constructor(modules?: T[]) {
    if (modules) this.modules = modules
  }

  public id = randomUUID() as string
  public name = ''
  public icon = ''
  public description = ''
  public nodes: FlowNodeInstance[] = []
  public links: Record<string, string> = {}
  public modules: T[] = []

  /** The event target that is used to dispatch and listen for events. */
  private eventTarget = new EventTarget()

  /**
   * Get the entrypoint of the flow. The entrypoint is the node that is
   * executed first when the flow is started.
   *
   * @returns The entrypoint of the flow.
   */
  private get entrypoint() {
    const entrypoints = [...this.nodes].filter(node => node.node.kind === 'core:entrypoint')
    if (entrypoints.length === 0) throw new Error('Entrypoint not found')
    if (entrypoints.length > 1) throw new Error('Multiple entrypoints found')
    return entrypoints[0]
  }

  /**
   * Dispatch an event to the flow. The event is dispatched to all nodes in
   * the flow.
   *
   * @param event The event to dispatch.
   * @param data The data to pass to the event listeners.
   */
  public dispatch<K extends keyof FlowEvents>(event: K, data: FlowEvents[K]) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }))
    this.eventTarget.dispatchEvent(new CustomEvent('event', { detail: [{ event, data }] }))
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
    const callback = (event: Event) => listener(...(event as CustomEvent).detail as [FlowEvents[K]])
    this.eventTarget.addEventListener(event, callback)
    return () => this.eventTarget.removeEventListener(event, callback)
  }

  /**
   * Set the settings of the flow. This includes the name, icon and description of
   * the flow that are displayed in the UI. Once called, an event is dispatched
   * to notify listeners that the settings have been updated.
   *
   * @param settings The settings to set for the flow.
   * @example flow.setSettings({ name: 'Flow', icon: 'flow', description: 'A flow' })
   */
  public setSettings(settings: Partial<FlowSettings>) {
    if (settings.name) this.name = settings.name
    if (settings.icon) this.icon = settings.icon
    if (settings.description) this.description = settings.description
    this.dispatch('flow:update', { name: this.name, icon: this.icon, description: this.description })
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
   * const flow = new Flow()
   * flow.createNode(Core.nodes.Entrypoint)
   * flow.createNode(Core.nodes.Log)
   */
  public async createNode<T extends FlowNode<string, any, any>>(node: T, options?: Omit<FlowNodeInstanceOptions<T>, 'flow' | 'node'>): Promise<void>
  public async createNode<K extends InferNodeKind<T>>(node: K, options?: Omit<FlowNodeInstanceOptions<InferNodeByKind<T, K>>, 'flow' | 'node'>): Promise<void>
  public async createNode(node: FlowNode | string, options?: Omit<FlowNodeInstanceOptions, 'flow' | 'node'>): Promise<void>
  public async createNode(node: FlowNode | string, options: Omit<FlowNodeInstanceOptions, 'flow' | 'node'> = {}) {

    // --- If the node is a string, get the node from the modules.
    if (typeof node === 'string') {
      const [moduleName, nodeName] = node.split(':')
      const module = this.modules.find(module => module.kind === moduleName)
      if (!module) throw new Error(`Module not found: ${moduleName}`)
      if (!module.nodes) throw new Error(`Module has no nodes: ${moduleName}`)
      const nodes = Object.values(module.nodes)
      const nodeToAdd = nodes.find(node => node.kind === nodeName)
      if (!nodeToAdd) throw new Error(`Node not found: ${nodeName}`)
      node = nodeToAdd
    }

    // --- Create the node instance and add it to the flow.
    const instance = createFlowNodeInstance({ ...options, flow: this, node })
    this.nodes.push(instance)
    await instance.resolveDataSchema()
    await instance.resolveResultSchema()
    this.dispatch('node:create', instance.toJSON())
    instance.on('data', data => this.dispatch('node:data', { id: instance.id, data }))
    instance.on('result', result => this.dispatch('node:result', { id: instance.id, result }))
    instance.on('dataSchema', schema => this.dispatch('node:dataSchema', { id: instance.id, schema }))
    instance.on('resultSchema', schema => this.dispatch('node:resultSchema', { id: instance.id, schema }))
  }

  /**
   * Delete a node from the flow by its ID. The node is removed from the flow
   * and all links to the node are removed. Once called, an event is dispatched
   * to notify listeners that the node has been removed.
   *
   * @param id The ID of the node to delete.
   * @example flow.deleteNode('01234567-89ab-cdef-0123-456789abcdef')
   */
  public removeNode(id: string) {
    this.getNode(id)
    this.nodes = this.nodes.filter(node => node.id !== id)
    this.removeLink(id)
    this.dispatch('node:remove', { id })
  }

  /**
   * Move a node to a new position. The position is used to render the node in
   * the correct position in the UI.
   *
   * @param id The ID of the node to move.
   * @param x The new x position of the node.
   * @param y The new y position of the node.`
   */
  public moveNode(id: string, x: number, y: number) {
    const node = this.getNode(id)
    node.position = { x, y }
    this.dispatch('node:move', { id, x, y })
  }

  /**
   * Link the output of a node to the input of another node. When processing
   * the flow, the output of the source node is passed as input to the target
   * node.
   *
   * @param source The ID of the source node.
   * @param target The ID of the target node.
   * @example flow.createLink('core:entrypoint', 'core:log')
   */
  public createLink(source: string, target: string): void {
    if (source in this.links) return

    // --- Extract the node and port IDs.
    const [sourceNodeId] = source.split(':')
    const [targetNodeId] = target.split(':')
    const sourceNode = this.getResultPort(source)
    const targetNode = this.getDataPort(target)

    // --- Check if the nodes can be linked.
    if (sourceNodeId === targetNodeId)
      throw new Error(`Cannot link the same node: ${sourceNodeId}`)
    if (sourceNode.type.kind !== targetNode.type.kind)
      throw new Error(`Cannot link ${sourceNode.type.kind} to ${targetNode.type.kind}`)

    // --- Link the nodes.
    this.links[source] = target
    this.dispatch('link:create', { source, target })
  }

  /**
   * Unlink the output of a node from the input of another node.
   *
   * @param portId The ID of the port to remove the link from.
   */
  public removeLink(portId: string): void {
    for (const [source, target] of Object.entries(this.links)) {
      if (target !== portId && source !== portId) continue
      delete this.links[source]
      this.dispatch('link:remove', { source, target })
    }
  }

  /**
   * Given a node ID, get the `FlowNode` that corresponds to the node ID.
   *
   * @param id The node ID to get the port and node for.
   * @returns The node that corresponds to the node ID.
   */
  public getNode(id: string) {
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
  public getResultPort(compositeId: string) {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNode(nodeId)
    const port = node.getResultPort(edgeId) as FlowNodePort
    return port
  }

  /**
   * Given an composite ID, get the `FlowNodePort` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the port separated by a colon.
   *
   * @param compositeId The composite ID to get the port and node for.
   * @returns The port that corresponds to the composite ID.
   */
  public getDataPort(compositeId: string) {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNode(nodeId)
    const port = node.getDataPort(edgeId) as FlowNodePort
    return port
  }

  /**
   * Set the value of the given port of the given node. The value is set on the
   * port and an event is dispatched to notify listeners that the value has been
   * updated.
   *
   * @param nodeId The ID of the node.
   * @param portId The ID of the port.
   * @param value The value to set on the port.
   */
  public async setNodeDataValue(nodeId: string, portId: string, value: unknown): Promise<void> {
    const node = this.getNode(nodeId)
    await node.setDataValue(portId, value)
  }

  /**
   * Process the flow. The flow is processed by executing the entrypoint
   * with the given input and letting the nodes trigger each other.
   */
  public process(): void {
    void this.entrypoint.process()
  }

  /**
   * Abort the flow. The flow is aborted by stopping the execution of all nodes
   * in the flow. This is useful when the flow is stuck in an infinite loop or
   * when the flow is no longer needed.
   */
  public abort(): void {
    for (const node of this.nodes) node.abort()
  }

  /**
   * Convert the flow to a JSON representation. The JSON representation can be
   * used to serialize the flow to a string or to send the flow over the network.
   *
   * @returns The JSON representation of the flow.
   */
  public toJSON(): FlowJSON {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      description: this.description,
      nodes: this.nodes.map(node => node.toJSON()),
      links: this.links,
    }
  }
}

/**
 * Create a new flow instance. The flow is a collection of nodes that are
 * linked together. The flow is processed by executing the entrypoint and
 * letting the nodes trigger each other.
 *
 * You can pass a list of modules to the flow. The modules are used to infer
 * the available node kinds that can be added to the flow.
 *
 * @param modules The modules to add to the flow.
 * @returns The new flow instance.
 * @example
 *
 * // Create a flow with the core module.
 * const flow = createFlow([Core])
 *
 * // Add nodes from the core module to the flow.
 * flow.createNode(Core.nodes.Entrypoint)
 * flow.createNode('core:log')
 */
export function createFlow<T extends FlowModule = FlowModule>(modules?: T[]): Flow<T> {
  return new Flow<T>(modules)
}

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {
  const { moduleExample } = await import('./__fixtures__')

  describe('constructor', () => {
    it('should create a flow with no modules', () => {
      const flow = new Flow()
      expect(flow).toMatchObject({
        id: expect.any(String),
        name: '',
        icon: '',
        description: '',
        nodes: [],
        links: {},
      })
    })

    it('should create a flow with modules', () => {
      const flow = new Flow([moduleExample])
      expect(flow.modules).toStrictEqual([moduleExample])
    })
  })

  describe('setSettings', () => {
    it('should set the settings of the flow', () => {
      const flow = new Flow()
      flow.setSettings({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
      })
      expect(flow).toMatchObject({
        name: 'Flow',
        icon: 'flow',
        description: 'A flow',
      })
    })
  })

  // describe('createNode', () => {
  //   it('should create a node with a node definition', () => {
  //     const flow = new Flow([moduleExample])
  //     flow.createNode(moduleExample.nodes.nodeParseBoolean)
  //     expect(flow.nodes).toHaveLength(1)
  //   })

  //   it('should create a node with a node definition and options', () => {
  //     const flow = new Flow([moduleExample])
  //     flow.createNode(moduleExample.nodes.nodeParseBoolean, { position: { x: 0, y: 0 } })
  //     expect(flow.nodes).toHaveLength(1)
  //   })

  //   it('should create a node with a node kind', () => {
  //     const flow = new Flow([moduleExample])
  //     flow.createNode('example:parse-boolean')
  //     expect(flow.nodes).toHaveLength(1)
  //   })

  //   it('should create a node with a node kind and options', () => {
  //     const flow = new Flow([moduleExample])
  //     flow.createNode('example:parse-boolean', { position: { x: 0, y: 0 } })
  //     expect(flow.nodes).toHaveLength(1)
  //   })
  // })
}
