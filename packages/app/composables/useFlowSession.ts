import type { FlowSessionJSON, FlowSessionPayload } from '@nwrx/api'
import { useAlerts, useClient } from '#imports'

export function useFlowSession(workspace: MaybeRef<string>, project: MaybeRef<string>, name: MaybeRef<string>) {
  const client = useClient()
  const alerts = useAlerts()
  const session = client.connect('WS /api/workspaces/:ws/:project/:flow/ws', {
    data: {
      ws: unref(workspace),
      project: unref(project),
      flow: unref(name),
    },
  })

  /** The current flow state. */
  const flow = reactive({
    name: '',
    icon: '',
    description: '',
    nodes: [],
    links: [],
    categories: [],
    isRunning: false,
    peers: [],
    peerId: '',
  }) as FlowSessionJSON

  /**
   * Handle the incoming messages from the server. This function is called
   * whenever the server-side flow is manipulated by the client or another peer.
   */
  session.on('message', (payload: FlowSessionPayload) => {
    switch (payload.event) {
      case 'flow:refresh': {
        flow.peerId = payload.peerId
        flow.name = payload.name
        flow.icon = payload.icon
        flow.description = payload.description
        flow.isRunning = payload.isRunning
        flow.peers.push(...payload.peers.filter(p => p.id !== flow.peerId))
        flow.nodes.push(...payload.nodes)
        flow.categories.push(...payload.categories)
        void nextTick(() => flow.links.push(...payload.links))
        break
      }
      case 'flow:metaValue': {
        const { key, value } = payload
        if (key === 'name') flow.name = value as string
        if (key === 'icon') flow.icon = value as string
        if (key === 'description') flow.description = value as string
        break
      }
      case 'flow:start': {
        flow.isRunning = true
        break
      }
      case 'flow:end':
      case 'flow:abort': {
        flow.isRunning = false
        break
      }

      // --- Node events.
      case 'node:create': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { event: _, ...node } = payload
        flow.nodes.push(node)
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:start': {
        const { id } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.isRunning = true
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:end':
      case 'node:abort': {
        const { id } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.isRunning = false
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:data': {
        const { id, data } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.data = data
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:dataSchema': {
        const { id, schema } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.dataSchema = schema
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:result': {
        const { id, result } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.result = result
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:resultSchema': {
        const { id, schema } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        node.resultSchema = schema
        flow.nodes = [...flow.nodes]
        break
      }
      case 'node:metaValue': {
        const { id, key, value } = payload
        const node = flow.nodes.find(n => n.id === id)
        if (!node) return
        if (key === 'label') node.label = value as string
        if (key === 'position') node.position = value as { x: number; y: number }
        flow.nodes = [...flow.nodes]
        flow.links = [...flow.links]
        break
      }
      case 'node:remove': {
        const { id } = payload
        flow.links.forEach((link, index) => {
          if (!link.source.startsWith(id) || !link.target.startsWith(id)) return
          flow.links.splice(index, 1)
        })
        const indexNode = flow.nodes.findIndex(x => x.id === id)
        flow.nodes.splice(indexNode, 1)
        break
      }

      // --- Link events.
      case 'link:create': {
        const { source, target } = payload
        flow.links.push({ source, target })
        break
      }
      case 'link:remove': {
        const { source, target } = payload
        const index = flow.links.findIndex(x => x.source === source && x.target === target)
        flow.links.splice(index, 1)
        break
      }

      // --- User events.
      case 'user:join': {
        const peer = payload
        if (peer.id === flow.peerId) return
        flow.peers.push({ ...peer, position: { x: 0, y: 0 } })
        break
      }
      case 'user:position': {
        const { id, x, y } = payload
        const peer = flow.peers.find(p => p.id === id)
        if (!peer) return
        peer.position.x = x
        peer.position.y = y
        break
      }
      case 'user:leave': {
        const { id } = payload
        flow.peers = flow.peers.filter(p => p.id !== id)
        break
      }

      // --- Error handling.
      case 'error': {
        const { message } = payload
        alerts.error(message)
        break
      }
    }
  })

  // --- Return the flow editor composable.
  return {
    flow,

    /**
     * Broadcast the current user's cursor position to all clients.
     * This is used to show the cursor of other users in the flow editor.
     * Note that the event is only sent if there are more than one user in the flow editor.
     *
     * @param x The x coordinate.
     * @param y The y coordinate.
     */
    userSetPosition: (x: number, y: number) => {
      if (flow.peers.length < 2) return
      session.send({ event: 'userSetPosition', x, y })
    },

    /**
     * Broadcast that the current user has left the flow editor. This will
     * remove the user from the list of peers in the flow editor.
     */
    userLeave: () => {
      session.send({ event: 'userLeave' })
      session.close()
    },

    /**
     * Start the flow execution. This will trigger the server to start the flow
     * execution and broadcast the start event to all clients including the current client.
     * The server will then execute the nodes in the flow in sequence.
     */
    flowRun: () => {
      session.send({ event: 'flowRun' })
    },

    /**
     * Abort the flow execution. This will trigger the server to abort the flow
     * execution and broadcast the abort event to all clients including the current client.
     * The server will then stop the execution of the nodes in the flow.
     */
    flowAbort: () => {
      session.send({ event: 'flowAbort' })
    },

    /**
     * Update the meta value of the flow and broadcast the update to all clients including
     * the current client.
     *
     * @param key The key of the property to update.
     * @param value The new value of the property.
     */
    flowSetMetaValue: (key: string, value: unknown) => {
      session.send({ event: 'flowSetMetaValue', key, value })
    },

    /**
     * Trigger the server to create a new node with the given kind at the x and y coordinates
     * and broadcast the creation of the node to all clients including the current client.
     *
     * @param kind The kind of the node.
     * @param x The x coordinate of the node.
     * @param y The y coordinate of the node.
     */
    nodeCreate: (kind: string, x: number, y: number) => {
      session.send({ event: 'nodeCreate', kind, x, y })
    },

    /**
     * Trigger the server to duplicate the node with the given id and broadcast the duplication
     * to all clients including the current client.
     *
     * @param nodeId The node id.
     * @param x The x coordinate of the duplicated node.
     * @param y The y coordinate of the duplicated node.
     */
    nodeDuplicate: (nodeId: string, x: number, y: number) => {
      session.send({ event: 'nodeDuplicate', nodeId, x, y })
    },

    /**
     * Trigger the run of the given node and broadcast the start event to all clients including
     * the current client.
     *
     * @param nodeId The node id.
     */
    nodeStart: (nodeId: string) => {
      session.send({ event: 'nodeStart', nodeId })
    },

    /**
     * Trigger the abort of the given node and broadcast the abort event to all clients including
     * the current client.
     *
     * @param nodeId The node id.
     */
    nodeAbort: (nodeId: string) => {
      session.send({ event: 'nodeAbort', nodeId })
    },

    /**
     * Trigger the server to move and broadcast the movement of multiple nodes to the new
     * x and y coordinates to all clients including the current client.
     *
     * @param nodes The list of nodes to move.
     */
    nodeSetPosition: (...nodes: FlowNodePosition[]) => {
      const payload = nodes.map(({ nodeId, x, y }) => ({ nodeId, key: 'position', value: { x, y } }))
      session.send({ event: 'nodeSetMetaValue', nodes: payload })
    },

    /**
     * Update the label of a node and broadcast the update to all clients including the current client.
     * The label is used to display the name of the node in the flow editor.
     *
     * @param nodeId The node id.
     * @param label The new label of the node.
     */
    nodeSetLabel: (nodeId: string, label: string) => {
      const payload = { nodeId, key: 'label', value: label }
      session.send({ event: 'nodeSetMetaValue', nodes: [payload] })
    },

    /**
     * Trigger the server to update a specific port value of the given node and broadcast
     * the update to all clients including the current client.
     *
     * @param nodeId The node id.
     * @param portId The port id.
     * @param value The new value of the port.
     */
    nodeSetDataValue: (nodeId: string, portId: string, value: unknown) => {
      session.send({ event: 'nodeSetDataValue', nodeId, portId, value })
    },

    /**
     * Delete the node with the given id. This will trigger the server to delete the
     * node and broadcast the deletion to all clients.
     *
     * @param nodeIds The list of node ids to remove.
     */
    nodeRemove: (nodeIds: string[]) => {
      session.send({ event: 'nodesRemove', nodeIds })
    },

    /**
     * Broadcast the creation of a link between the source and target nodes.
     *
     * @param source The source node:port ID.
     * @param target The target node:port ID.
     */
    linkCreate: (source: string, target: string) => {
      session.send({ event: 'linkCreate', source, target })
    },

    /**
     * Broadcast the removal of a link between the source and target nodes.
     *
     * @param source The source node id.
     */
    linkRemove: (source: string) => {
      session.send({ event: 'linkRemove', source })
    },
  }
}
