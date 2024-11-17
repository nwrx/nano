/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/prefer-single-boolean-return */
import type { FlowNodeDefinition, SocketListOption } from '../module'
import type { FlowEvents, FlowJSONv1, FlowJSONv1Node, FlowLink, FlowNode, FlowOptions } from '../utils'
import { Memoize } from '@unshared/decorators'
import { createReference, Emitter, isReferenceLink, resolveSchema } from '../utils'
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

  createNode(node: FlowNode): FlowNode {
    if (this.nodes.some(n => n.id === node.id)) throw new Error(`A node with ID "${node.id}" already exists`)
    this.nodes.push(node)
    this.dispatch('createNode', node)
    return node
  }

  removeNodes(...ids: string[]): void {
    const nodes = ids.map(id => this.get(id))
    this.nodes = this.nodes.filter(node => !nodes.includes(node))
    this.dispatch('removeNodes', nodes)
  }

  setNodeInputValue(id: string, key: string, value: unknown) {
    const node = this.get(id)
    node.input = node.input ?? {}
    node.input[key] = value
    this.dispatch('setNodeInputValue', node, key, value)
  }

  setNodesMetaValue(id: string, key: string, value: unknown) {
    const node = this.get(id)
    node.meta = node.meta ?? {}
    node.meta[key] = value
    this.dispatch('setNodeMetaValue', node, key, value)
  }

  async getNodeInputValueOptions(id: string, key: string, query?: string): Promise<SocketListOption[]> {
    const node = this.get(id)
    const definition = await this.describe(node.kind)
    const schema = definition.inputSchema
    const socket = schema?.[key]
    const options = socket?.options

    // --- Assert that the schema and socket exist.
    if (typeof options !== 'function') return options ?? []
    const input = await resolveSchema({
      values: node.input,
      schema: definition.inputSchema,
      resolvers: this.options.resolveReference,
      skipErrors: true,
    })
    return options(input, query)
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
              sourceName: x.$fromNode.name,
              sourcePath: x.$fromNode.path,
              targetId: node.id,
              targetName: key,
            })
          }
        }

        // --- If the value is a map, iterate over each value and add the links.
        else if (typeof value === 'object' && value !== null && !isReferenceLink(value)) {
          for (const path in value) {
            const x = (value as Record<string, unknown>)[path]
            if (!isReferenceLink(x)) continue
            links.push({
              sourceId: x.$fromNode.id,
              sourceName: x.$fromNode.name,
              sourcePath: x.$fromNode.path,
              targetId: node.id,
              targetName: key,
              targetPath: path,
            })
          }
        }

        // --- Otherwise, add the link if the value is a link.
        else if (isReferenceLink(value)) {
          links.push({
            sourceId: value.$fromNode.id,
            sourceName: value.$fromNode.name,
            sourcePath: value.$fromNode.path,
            targetId: node.id,
            targetName: key,
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
    const sourceSocket = sourceKind.outputSchema?.[link.sourceName]

    const target = this.get(link.targetId)
    const targetKind = await this.describe(target.kind)
    const targetSocket = targetKind.inputSchema?.[link.targetName]

    // --- Verify that the source and target can be linked.
    if (!target) throw new Error(`The target node "${link.targetId}" does not exist`)
    if (!source) throw new Error(`The source node "${link.sourceId}" does not exist`)
    if (!sourceSocket) throw new Error(`The source socket "${link.sourceName}" does not exist on node "${link.sourceId}"`)
    if (!targetSocket) throw new Error(`The target socket "${link.targetName}" does not exist on node "${link.targetId}"`)
    // if (sourceSocket.type !== targetSocket.type) throw new Error('Cannot link sockets of different types')
    if (link.sourceId === link.targetId) throw new Error('Cannot link a node to itself')

    // --- Compute the new value for the target socket.
    const newValue = createReference('fromNode', { id: link.sourceId, name: link.sourceName })

    // --- If iterable, append the value to the target socket.
    if (targetSocket.isIterable) {
      const input = target.input ?? {}
      const value = input[link.targetName] ?? []
      const valueArray: unknown[] = Array.isArray(value) ? value : [value]
      const valueIsAlreadyLinked = valueArray.some(value =>
        isReferenceLink(value)
        && value.$fromNode.id === link.sourceId
        && value.$fromNode.name === link.sourceName)
      const nextValue = valueIsAlreadyLinked ? [...valueArray, newValue] : [newValue]
      this.setNodeInputValue(link.targetId, link.targetName, nextValue)
    }

    // --- If map, set the value to the target at the given path.
    else if (link.targetPath) {
      const input = target.input ?? {}
      const value = input[link.targetName] ?? {}
      const nextValue = { ...value, [link.targetPath]: newValue }
      this.setNodeInputValue(link.targetId, link.targetName, nextValue)
    }

    // --- Otherwise, append the value to the target socket.
    else { this.setNodeInputValue(link.targetId, link.targetName, newValue) }
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
        if (linkToRemove.targetName && key !== linkToRemove.targetName) continue
        const definition = await this.describe(node.kind)
        const value = node.input[key]
        const socket = definition.inputSchema?.[key]

        // --- Handle the case where the value is an array of links.
        if (socket?.isIterable && Array.isArray(value)) {
          const newValue = value.filter((value) => {
            if (!isReferenceLink(value)) return true
            if (linkToRemove.sourceId && value.$fromNode.id !== linkToRemove.sourceId) return true
            if (linkToRemove.sourceName && value.$fromNode.name !== linkToRemove.sourceName) return true
            return false
          })
          this.setNodeInputValue(node.id, key, newValue)
        }

        // --- Handle the case where the value is a map.
        else if (socket?.isMap && typeof value === 'object' && value !== null && !isReferenceLink(value)) {
          const valueEntries = Object.entries(value)
          const newValue = Object.fromEntries(valueEntries.map(([path, value]) => {
            if (!isReferenceLink(value)) return [path, undefined]
            if (linkToRemove.sourceId && value.$fromNode.id !== linkToRemove.sourceId) return [path, undefined]
            if (linkToRemove.sourceName && value.$fromNode.name !== linkToRemove.sourceName) return [path, undefined]
            if (linkToRemove.sourcePath && value.$fromNode.path !== linkToRemove.sourcePath) return [path, undefined]
            return [path, undefined]
          }))
          this.setNodeInputValue(node.id, key, newValue)
        }

        // --- Set the value to `undefined` if the source and target are specified.
        else {
          if (!isReferenceLink(value)) continue
          if (linkToRemove.sourceId && value.$fromNode.id !== linkToRemove.sourceId) continue
          if (linkToRemove.sourceName && value.$fromNode.name !== linkToRemove.sourceName) continue
          this.setNodeInputValue(node.id, key, undefined)
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
        flow.createNode({ id, kind, input, meta })
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
