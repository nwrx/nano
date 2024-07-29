import { UUID } from 'node:crypto'
import { ChainNode, ChainNodeObject } from './defineChainNode'

/**
 * A map of events that can be dispatched by a chain node and the parameters
 * that are passed to the event listeners.
 */
interface ChainEvents {
  nodeAdd: [ChainNodeObject]
  nodeData: [string, Record<string, unknown>]
  nodeResult: [string, Record<string, unknown>]

  // Links
  'update:node': [ChainNodeObject]
  'update:nodes': [ChainNodeObject[]]
  'update:links': [Record<string, string>]
  'update:settings': [settings: ChainSettings]

  // Chain
  'thread:start': [input: Record<string, unknown>]
  'thread:end': []
  'thread:data': [data: Record<string, unknown>]
  'thread:output': [output: Record<string, unknown>]

  event: [{ event: string; [x: string]: unknown }]
  error: [Error]
}

export interface ChainSettings {
  name: string
  icon: string
  description: string
}

/**
 * A listener for a chain node event. The listener is called when the event is
 * dispatched by the chain node.
 */
type ChainListener<K extends keyof ChainEvents> =
  (...parameters: ChainEvents[K]) => void

/**
 * a `Chain` is a collection of `ChainNode`s that are linked together. The chain
 * is processed by executing the entrypoint and letting the nodes trigger each
 * other.
 *
 * The chain also provides a way to dispatch and listen for events that are
 * triggered by changes in the chain.
 */
export class Chain {
  id: UUID
  name = ''
  icon = ''
  description = ''
  nodes: ChainNode[] = []
  links: Record<string, string> = {}

  /** The event target that is used to dispatch and listen for events. */
  private eventTarget = new EventTarget()

  /**
   * Get the entrypoint of the chain. The entrypoint is the node that is
   * executed first when the chain is started.
   *
   * @returns The entrypoint of the chain.
   */
  private get entrypoint() {
    const entrypoints = [...this.nodes].filter(node => node.name === 'core:entrypoint')
    if (entrypoints.length === 0) throw new Error('Entrypoint not found')
    if (entrypoints.length > 1) throw new Error('Multiple entrypoints found')
    return entrypoints[0]
  }

  /**
   * Dispatch an event to the chain. The event is dispatched to all nodes in
   * the chain.
   *
   * @param event The event to dispatch.
   * @param data The data to pass to the event listeners.
   */
  public dispatch<K extends keyof ChainEvents>(event: K, ...data: ChainEvents[K]) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }))
    this.eventTarget.dispatchEvent(new CustomEvent('event', { detail: [{ event, data }] }))
  }

  /**
   * Add a listener for a chain event. The listener is called when the event is
   * dispatched by the chain.
   *
   * @param event The event to listen for.
   * @param listener The listener to call when the event is dispatched.
   * @returns A function that removes the listener when called.
   */
  public on<K extends keyof ChainEvents>(event: K, listener: ChainListener<K>) {
    const callback = (event: Event) => listener(...(event as CustomEvent).detail as ChainEvents[K])
    this.eventTarget.addEventListener(event, callback)
    return () => this.eventTarget.removeEventListener(event, callback)
  }

  public setSettings(settings: Partial<ChainSettings>) {
    if (settings.name) this.name = settings.name
    if (settings.icon) this.icon = settings.icon
    if (settings.description) this.description = settings.description
    this.dispatch('update:settings', { name: this.name, icon: this.icon, description: this.description })
  }

  /**
   * Push a node to the chain. The node is instantiated with the given options
   * and added to the chain.
   *
   * @param nodes The nodes to push to the chain.
   */
  public addNode(...nodes: Array<ChainNode<any, any>>): void {
    for (const node of nodes) {
      node.chain = this
      this.nodes.push(node)
      node.on('data', data => this.dispatch('nodeData', node.id, data))
      node.on('result', result => this.dispatch('nodeResult', node.id, result))
      this.dispatch('update:node', node.toJSON())
    }
  }

  /**
   * Link the output of a node to the input of another node. When processing
   * the chain, the output of the source node is passed as input to the target
   * node.
   *
   * @param source The ID of the source node.
   * @param target The ID of the target node.
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
    if (sourceNode.type.name !== targetNode.type.name)
      throw new Error(`Cannot link ${sourceNode.type.name} to ${targetNode.type.name}`)

    // --- Link the nodes.
    this.links[source] = target
    this.dispatch('update:links', this.links)
  }

  /**
   * Unlink the output of a node from the input of another node.
   *
   * @param nodeId The ID of the source node.
   */
  public removeLink(nodeId: string) {
    for (const [key, value] of Object.entries(this.links))
      if (key === nodeId || value === nodeId) delete this.links[key]
    this.dispatch('update:links', this.links)
  }

  /**
   * Move a node to a new position. The position is used to render the node in
   * the correct position in the UI.
   *
   * @param nodeId The ID of the node to move.
   * @param x The new x position of the node.
   * @param y The new y position of the node.
   */
  public updateNodePosition(nodeId: string, x: number, y: number) {
    const node = this.getNode(nodeId)
    node.position = { x, y }
    this.dispatch('update:node', node.toJSON())
  }

  /**
   * Given a node ID, get the `ChainNode` that corresponds to the node ID.
   *
   * @param nodeId The node ID to get the port and node for.
   * @returns The node that corresponds to the node ID.
   */
  public getNode(nodeId: string) {
    const nodes = [...this.nodes]
    const node = nodes.find(node => node.id === nodeId)
    if (!node) throw new Error(`Node not found: ${nodeId}`)
    return node
  }

  /**
   * Given an composite ID, get the `ChainNodePort` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the port separated by a colon.
   *
   * @param compositeId The composite ID to get the port and node for.
   * @returns The port that corresponds to the composite ID.
   */
  public getResultPort(compositeId: string) {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNode(nodeId)
    const port = node.getResultPort(edgeId)
    return port
  }

  /**
   * Given an composite ID, get the `ChainNodePort` that corresponds to the
   * `{nodeId}:{edgeId}`. The composite ID is the ID of the node and the ID of
   * the port separated by a colon.
   *
   * @param compositeId The composite ID to get the port and node for.
   * @returns The port that corresponds to the composite ID.
   */
  public getDataPort(compositeId: string) {
    const [nodeId, edgeId] = compositeId.split(':')
    const node = this.getNode(nodeId)
    const port = node.getDataPort(edgeId)
    return port
  }

  /**
   * Process the chain. The chain is processed by executing the entrypoint
   * with the given input and letting the nodes trigger each other.
   */
  public process() {
    void this.entrypoint.execute()
  }

  public toJSON() {
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
