import type { FlowJSON, FlowNodeInstanceJSON, FlowSchema, FlowSettings } from '@nanoworks/core'
import type { UUID } from 'node:crypto'

export function useFlowEditor(id: UUID) {
  const client = useClient()
  const session = client.connect('WS /api/flows/editor')

  const flow = reactive({
    id,
    icon: '',
    name: '',
    description: '',
    nodes: [],
    links: {},
  }) as FlowJSON

  /**
   * When initializing the flow editor, request the flow data from the server.
   * This will trigger the server to send the flow data to the client.
   */
  setTimeout(() => session.send({ id, data: { event: 'refreshFlow' } }), 100)

  /**
   * Handle the incoming messages from the server. This function is called
   * whenever the server-side flow is manipulated by the client or another peer.
   */
  session.on('message', (payload: { event: string; data: unknown }) => {
    switch (payload.event) {
      case 'flow:refresh': {
        const data = payload.data as FlowJSON
        flow.name = data.name
        flow.icon = data.icon
        flow.description = data.description
        flow.nodes = data.nodes
        // Update in a next tick to avoid reactivity issues.
        void nextTick(() => flow.links = data.links)
        break
      }

      // --- Node events.
      case 'node:create': {
        flow.nodes.push(payload.data as FlowNodeInstanceJSON)
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:dataValue': {
        const { id, portId, value } = payload.data as { id: string; portId: string; value: unknown }
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.data[portId] = value
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:dataSchema': {
        const { id, schema } = payload.data as { id: string; schema: FlowSchema }
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.dataSchema = schema
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:resultSchema': {
        const { id, schema } = payload.data as { id: string; schema: FlowSchema }
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.resultSchema = schema
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:move': {
        const { id, x, y } = payload.data as { id: string; x: number; y: number }
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.position.x = x
        node.position.y = y
        flow.nodes = [...flow.nodes]
        flow.links = { ...flow.links }
        break
      }
      case 'node:remove': {
        const { id } = payload.data as { id: string }
        flow.nodes = flow.nodes.filter(x => x.id !== id)
        break
      }

      // --- Link events.
      case 'link:create': {
        const { source, target } = payload.data as { source: string; target: string }
        flow.links[source] = target
        flow.links = { ...flow.links }
        break
      }
      case 'link:remove': {
        const { source } = payload.data as { source: string }
        delete flow.links[source]
        flow.links = { ...flow.links }
        break
      }
    }
  })

  // --- Return the flow editor composable.
  return {
    flow,

    /**
     * Trigger the server to create a new node with the given kind at the x and y coordinates
     * and broadcast the creation of the node to all clients including the current client.
     *
     * @param kind The kind of the node.
     * @param x The x coordinate of the node.
     * @param y The y coordinate of the node.
     */
    createNode: (kind: string, x: number, y: number) => {
      session.send({ id, data: { event: 'createNode', kind, x, y } })
    },

    /**
     * Trigger the server to move and broadcast the movement of the node with the given id
     * to the new x and y coordinates to all clients including the current client.
     *
     * @param nodeId The node id.
     * @param x The x coordinate.
     * @param y The y coordinate.
     */
    moveNode: (nodeId: string, x: number, y: number) => {
      session.send({ id, data: { event: 'moveNode', nodeId, x, y } })
      flow.links = { ...flow.links }
    },

    /**
     * Trigger the server to update a specific port value of the given node and broadcast
     * the update to all clients including the current client.
     *
     * @param nodeId The node id.
     * @param portId The port id.
     * @param value The new value of the port.
     */
    setNodeDataValue: (nodeId: string, portId: string, value: unknown) => {
      session.send({ id, data: { event: 'setNodeDataValue', nodeId, portId, value } })
    },

    /**
     * Delete the node with the given id. This will trigger the server to delete the
     * node and broadcast the deletion to all clients.
     *
     * @param nodeId The node id.
     */
    removeNode: (nodeId: string) => {
      session.send({ id, data: { event: 'removeNode', nodeId } })
    },

    /**
     * Broadcast the creation of a link between the source and target nodes.
     *
     * @param source The source node:port ID.
     * @param target The target node:port ID.
     */
    createLink: (source: string, target: string) => {
      session.send({ id, data: { event: 'createLink', source, target } })
    },

    /**
     * Broadcast the removal of a link between the source and target nodes.
     *
     * @param source The source node id.
     */
    removeLink: (source: string) => {
      session.send({ id, data: { event: 'removeLink', source } })
    },

    /**
     * Update the settings of the flow with the given data.
     *
     * @param settings The settings to update.
     */
    updateSettings: (settings: Partial<FlowSettings>) => {
      session.send({ id, data: { event: 'updateSettings', ...settings as FlowSettings } })
    },
  }
}
