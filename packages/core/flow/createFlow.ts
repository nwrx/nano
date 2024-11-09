/* eslint-disable sonarjs/prefer-single-boolean-return */
import type { FlowNodeDefinition } from '../module'
import type { FlowEvents, FlowJSONv1, FlowJSONv1Node, FlowLink, FlowNode, FlowOptions } from '../utils'
import { Memoize } from '@unshared/decorators'
import { createReference, Emitter, isReferenceLink } from '../utils'
import { FlowThread } from './createFlowThread'

export class Flow extends Emitter<FlowEvents> {
  constructor(
    public nodes: FlowNode[] = [],
    public options: FlowOptions = {},
  ) {
    super()
  }

  /***************************************************************************/
  /* Editor                                                                  */
  /***************************************************************************/

  get(id: string): FlowNode {
    const node = this.nodes.find(node => node.id === id)
    if (!node) throw new Error(`The node with ID "${id}" does not exist`)
    return node
  }

  create(node: FlowNode): FlowNode {
    if (this.nodes.some(n => n.id === node.id)) throw new Error(`A node with ID "${node.id}" already exists`)
    this.nodes.push(node)
    this.dispatch('createNode', node)
    return node
  }

  remove(...ids: string[]): void {
    const nodes = ids.map(id => this.get(id))
    this.nodes = this.nodes.filter(node => !nodes.includes(node))
    this.dispatch('removeNodes', nodes)
  }

  setDataValue(id: string, key: string, value: unknown) {
    const node = this.get(id)
    node.input = node.input ?? {}
    node.input[key] = value
    this.dispatch('setNodeDataValue', node, key, value)
  }

  setMetaValue(id: string, key: string, value: unknown) {
    const node = this.get(id)
    node.meta = node.meta ?? {}
    node.meta[key] = value
    this.dispatch('setNodeMetaValue', node, key, value)
  }

  /***************************************************************************/
  /* Helpers                                                                 */
  /***************************************************************************/

  /**
   * Get all the links between the nodes in the flow. This function iterates over
   * all the nodes in the flow and collects the links between the nodes. If a node
   * has a property that is a string that matches the expected format of a link,
   * the link is added to the list of links.
   *
   * @returns The list of links between the nodes in the flow.
   * @example
   *
   * // Create a new flow instance with interconnected nodes.
   * const flow = new Flow()
   * const node1 = flow.createNode({ id: 'node1', ... })
   * const node2 = flow.createNode({ id: 'node2', input: { input: '$NODE.node1:output' } })
   * const node3 = flow.createNode({ id: 'node3', input: { input: ['$NODE.node1:output', '$NODE.node2:output'] } })
   *
   * // Get all the links between the nodes in the flow.
   * const links = flow.getLinks()
   * // => [
   * //   { sourceId: 'node1', sourceKey: 'output', targetId: 'node2', targetKey: 'input' },
   * //   { sourceId: 'node1', sourceKey: 'output', targetId: 'node3', targetKey: 'input' },
   * //   { sourceId: 'node2', sourceKey: 'output', targetId: 'node3', targetKey: 'input' },
   * // ]
   */
  getLinks(): FlowLink[] {
    const links: FlowLink[] = []
    for (const node of this.nodes) {
      for (const key in node.input) {
        const value = node.input[key]

        // --- If the value is an array, iterate over each value and add the links.
        if (Array.isArray(value)) {
          for (const x of value) {
            if (!isReferenceLink(x)) continue
            links.push({
              sourceId: x.$fromNode.id,
              sourceKey: x.$fromNode.key,
              sourcePath: x.$fromNode.path,
              targetId: node.id,
              targetKey: key,
            })
          }
        }

        // --- Otherwise, add the link if the value is a link.
        else {
          if (!isReferenceLink(value)) continue
          links.push({
            sourceId: value.$fromNode.id,
            sourceKey: value.$fromNode.key,
            sourcePath: value.$fromNode.path,
            targetId: node.id,
            targetKey: key,
          })
        }
      }
    }

    // --- Return the links collected so far.
    return links
  }

  /**
   * Link the output of a node to the input of another node. When processing
   * the flow, the output of the source node is passed as input to the target
   * node.
   *
   * @param link The link to create between the source and target node.
   * @example flow.createLink({ sourceId: 'node-1', sourceKey: 'output', targetId: 'node-2', targetKey: 'input' })
   */
  async createlink(link: FlowLink): Promise<void> {
    const source = this.get(link.sourceId)
    const sourceKind = await this.describe(source.kind)
    const sourceSocket = sourceKind.outputSchema?.[link.sourceKey]

    const target = this.get(link.targetId)
    const targetKind = await this.describe(target.kind)
    const targetSocket = targetKind.inputSchema?.[link.targetKey]

    // --- Verify that the source and target can be linked.
    if (!target) throw new Error(`The target node "${link.targetId}" does not exist`)
    if (!source) throw new Error(`The source node "${link.sourceId}" does not exist`)
    if (!sourceSocket) throw new Error(`The source socket "${link.sourceKey}" does not exist on node "${link.sourceId}"`)
    if (!targetSocket) throw new Error(`The target socket "${link.targetKey}" does not exist on node "${link.targetId}"`)
    // if (sourceSocket.type !== targetSocket.type) throw new Error('Cannot link sockets of different types')
    if (link.sourceId === link.targetId) throw new Error('Cannot link a node to itself')

    // --- Compute the new value for the target socket.
    const newValue = createReference('fromNode', { id: link.sourceId, key: link.sourceKey })

    // --- If the target socket is not iterable, set the value directly.
    if (!targetSocket.isIterable) {
      this.setDataValue(link.targetId, link.targetKey, newValue)
      return
    }

    // --- Otherwise, append the value to the target socket.
    target.input = target.input ?? {}
    const currentValue = target.input[link.targetKey] ?? []
    const nextValue = Array.isArray(currentValue) ? [...currentValue as unknown[], newValue] : [newValue]
    this.setDataValue(link.targetId, link.targetKey, nextValue)
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
   * @param linkToRemove The link to remove between the source and target node.
   * @example flow.removeLink({ sourceId: 'node-1', sourceKey: 'output', targetId: 'node-2', targetKey: 'input' })
   */
  async removeLink(linkToRemove: Partial<FlowLink>): Promise<void> {
    for (const node of this.nodes) {
      if (linkToRemove.targetId && node.id !== linkToRemove.targetId) continue

      for (const key in node.input) {
        if (linkToRemove.targetKey && key !== linkToRemove.targetKey) continue
        const definition = await this.describe(node.kind)
        const value = node.input[key]
        const socket = definition.inputSchema?.[key]

        // --- Filter out the link if the source and target are specified.
        if (socket?.isIterable && Array.isArray(value)) {
          const newValue = value.filter((value) => {
            if (!isReferenceLink(value)) return true
            if (linkToRemove.sourceId && value.$fromNode.id !== linkToRemove.sourceId) return true
            if (linkToRemove.sourceKey && value.$fromNode.key !== linkToRemove.sourceKey) return true
            return false
          })
          this.setDataValue(node.id, key, newValue)
        }

        // --- Set the value to `undefined` if the source and target are specified.
        else {
          if (!isReferenceLink(value)) continue
          if (linkToRemove.sourceId && value.$fromNode.id !== linkToRemove.sourceId) continue
          if (linkToRemove.sourceKey && value.$fromNode.key !== linkToRemove.sourceKey) continue
          this.setDataValue(node.id, key, undefined)
        }
      }
    }
  }

  @Memoize()
  async describe(kind: string): Promise<FlowNodeDefinition> {
    for (const resolve of this.options.resolveNode ?? []) {
      const definition = await resolve(kind)
      if (definition) return definition
    }
    throw new Error(`The node with kind "${kind}" could not be resolved`)
  }

  /***************************************************************************/
  /* Runtime                                                                 */
  /***************************************************************************/

  createThread() {
    return new FlowThread(this)
  }

  [Symbol.dispose]() {
    this.clearListeners()
  }

  /***************************************************************************/
  /* Serialization                                                           */
  /***************************************************************************/

  static fromJSON(json: FlowJSONv1, options: FlowOptions = {}): Flow {
    const { version, nodes = {} } = json

    // --- Assert that the version is supported.
    if (!version) throw new Error('Flow file version is missing')
    if (version !== '1') throw new Error(`Unsupported flow file version: ${version}`)

    // --- Create the flow instance with the settings and nodes.
    // --- Collect all the instances to add to the flow.
    const flow = new Flow([], options)
    for (const id in nodes) {
      const { kind, ...data } = nodes[id]
      const meta: Record<string, unknown> = {}
      const input: Record<string, unknown> = {}

      // --- Collect the static data and the links.
      // --- If the key starts with an underscore, store it as meta data.
      // --- Otherwise, store the value as initial data.
      for (const key in data) {
        const value = data[key]
        if (key.startsWith('_')) meta[key.slice(1)] = value
        else input[key] = value
      }

      // --- Create the node instance.
      try {
        flow.create({ id, kind, input, meta })
      }
      catch (error) {
        const message = (error as Error).message
        console.error(message)
      }
    }

    // --- Return the flow instance.
    return flow
  }

  toJSON(): FlowJSONv1 {
    const nodes: Record<string, FlowJSONv1Node> = {}
    for (const node of this.nodes) {
      const meta: Record<string, unknown> = {}
      for (const key in node.meta) {
        const metaKey = `_${key}`
        const metaValue = node.meta[key]
        meta[metaKey] = metaValue
      }
      nodes[node.id] = { kind: node.kind, ...meta, ...node.input }
    }

    return {
      version: '1',
      nodes,
    }
  }
}
