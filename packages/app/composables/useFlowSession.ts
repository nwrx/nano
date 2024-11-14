/* eslint-disable sonarjs/cognitive-complexity */
import type { FlowJSON, FlowSessionEventPayload } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'
import { useAlerts, useClient } from '#imports'

export function useFlowSession(workspace: MaybeRef<string>, project: MaybeRef<string>, name: MaybeRef<string>) {
  const client = useClient()
  const alerts = useAlerts()
  const session = client.connect('WS /ws/workspaces/:workspace/:project/:flow', {
    data: {
      workspace: unref(workspace),
      project: unref(project),
      flow: unref(name),
    },
  })

  const data = reactive({
    name: '',
    icon: '',
    description: '',
    nodes: [],
    categories: [],
    events: [],
    secrets: [],
    variables: [],
    isRunning: false,
    peers: [],
    peerId: '',
  }) as FlowJSON

  session.on('message', (payload: FlowSessionEventPayload) => {
    data.events = [...data.events, payload]
    switch (payload.event) {
      case 'init': {
        data.name = payload.name
        data.icon = payload.icon
        data.description = payload.description
        data.nodes = payload.nodes
        data.categories = payload.categories
        data.secrets = payload.secrets
        data.variables = payload.variables
        data.isRunning = payload.isRunning
        data.peers = payload.peers.filter(p => p.id !== data.peerId)
        data.peerId = payload.peerId
        break
      }

      /***************************************************************************/
      /* Thread                                                                  */
      /***************************************************************************/

      case 'thread:start': {
        data.isRunning = true
        break
      }
      case 'thread:end':
      case 'thread:abort': {
        data.isRunning = false
        break
      }
      case 'error':
      case 'thread:error': {
        const { message } = payload
        alerts.error(message)
        break
      }
      case 'thread:nodeStart': {
        const { id } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return
        node.error = undefined
        data.nodes = [...data.nodes]
        break
      }
      case 'thread:nodeEnd': {
        const { id, output } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return
        node.output = output
        data.nodes = [...data.nodes]
        break
      }
      case 'thread:nodeError': {
        const { id, code, message } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return console.warn('node not found', id, data.nodes.map(n => n.id))
        node.error = message
        node.errorCode = code
        data.nodes = [...data.nodes]
        break
      }
      case 'thread:nodeState': {
        const { id, state } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return
        node.state = state
        data.nodes = [...data.nodes]
        break
      }

      /***************************************************************************/
      /* Editor                                                                  */
      /***************************************************************************/

      case 'meta': {
        const { key, value } = payload
        if (key === 'name') data.name = value as string
        if (key === 'icon') data.icon = value as string
        if (key === 'description') data.description = value as string
        break
      }
      case 'node:created': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { event, ...node } = payload
        data.nodes.push(node)
        data.nodes = [...data.nodes]
        break
      }
      case 'node:metaValueChanged': {
        const { id, key, value } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return console.warn('node not found', id)
        if (key === 'label') node.label = value as string
        if (key === 'comment') node.comment = value as string
        if (key === 'position') node.position = value as { x: number; y: number }
        break
      }
      case 'node:inputValueChanged': {
        const { id, key, value } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return
        node.input[key] = value
        break
      }
      case 'node:inputOptionResult': {
        const { id, key, options } = payload
        const node = data.nodes.find(n => n.id === id)
        if (!node) return
        const socket = node.inputSchema?.find(s => s.key === key)
        if (!socket) return
        socket.options = options
        data.nodes = [...data.nodes]
        break
      }
      case 'node:removed': {
        const { ids } = payload
        data.nodes = data.nodes.filter(n => !ids.includes(n.id))
        break
      }

      /***************************************************************************/
      /* Users                                                                   */
      /***************************************************************************/
      case 'user:join': {
        const peer = payload
        if (peer.id === data.peerId) return
        data.peers.push({ ...peer, position: { x: 0, y: 0 } })
        break
      }
      case 'user:position': {
        const { id, x, y } = payload
        const peer = data.peers.find(p => p.id === id)
        if (!peer) return
        peer.position = { x, y }
        break
      }
      case 'user:leave': {
        const { id } = payload
        data.peers = data.peers.filter(p => p.id !== id)
        break
      }
    }
  })

  return {
    data,
    clearEvents: () => data.events = [],

    /***************************************************************************/
    /* Thread                                                                  */
    /***************************************************************************/

    start: (input: Record<string, unknown>) => {
      session.send({ event: 'start', input })
    },

    abort: () => {
      session.send({ event: 'abort' })
    },

    startNode: (id: string) => {
      session.send({ event: 'startNode', id })
    },

    abortNode: (id: string) => {
      session.send({ event: 'abortNode', id })
    },

    /***************************************************************************/
    /* Flow                                                                    */
    /***************************************************************************/

    setName: (name: string) => {
      session.send({ event: 'setMetaValue', key: 'name', value: name })
    },

    setDescription: (description: string) => {
      session.send({ event: 'setMetaValue', key: 'description', value: description })
    },

    /***************************************************************************/
    /* Secrets & Variables                                                     */
    /***************************************************************************/

    createVariable: (name: string, value: string) => {
      session.send({ event: 'createVariable', name, value })
    },

    updateVariable: (name: string, value: string) => {
      session.send({ event: 'updateVariable', name, value })
    },

    removeVariable: (name: string) => {
      session.send({ event: 'removeVariable', name })
    },

    createSecret: (name: string, value: string) => {
      session.send({ event: 'createSecret', name, value })
    },

    updateSecret: (name: string, value: string) => {
      session.send({ event: 'updateSecret', name, value })
    },

    removeSecret: (name: string) => {
      session.send({ event: 'removeSecret', name })
    },

    /***************************************************************************/
    /* Nodes                                                                   */
    /***************************************************************************/

    createNode: (kind: string, x: number, y: number) => {
      session.send({ event: 'createNode', kind, x, y })
    },

    cloneNodes: (id: string, x: number, y: number) => {
      session.send({ event: 'cloneNodes', id, x, y })
    },

    removeNodes: (ids: string[]) => {
      session.send({ event: 'removeNodes', ids })
    },

    setNodesPosition: (positions: FlowNodePosition[]) => {
      session.send({
        event: 'setNodesPosition',
        positions: positions.map(({ id, x, y }) => ({
          id,
          x: Math.round(x),
          y: Math.round(y),
        })),
      })
    },

    setNodeLabel: (id: string, label: string) => {
      session.send({ event: 'setNodeLabel', id, label })
    },

    setNodeComment: (id: string, comment: string) => {
      session.send({ event: 'setNodeComment', id, comment })
    },

    setNodeInputValue: (id: string, key: string, value: unknown) => {
      session.send({ event: 'setNodeInputValue', id, key, value })
    },

    getNodeInputOptions: async(id: string, key: string, query?: string): Promise<SocketListOption[]> => {
      const promise = new Promise<SocketListOption[]>((resolve, reject) => {
        const stop = session.on('message', (payload: FlowSessionEventPayload) => {
          if (payload.event === 'error') reject(new Error(payload.message))
          if (payload.event !== 'node:inputOptionResult') return
          resolve(payload.options)
          stop()
        })
      })
      session.send({ event: 'getInputValueOptions', id, key, query })
      return await promise
    },

    /***************************************************************************/
    /* Links                                                                   */
    /***************************************************************************/

    createLink: (source: string, target: string) => {
      session.send({ event: 'createLink', source, target })
    },

    removeLink: (source: string) => {
      session.send({ event: 'removeLink', source })
    },

    /***************************************************************************/
    /* User                                                                    */
    /***************************************************************************/

    setUserPosition: (x: number, y: number) => {
      if (data.peers.length < 2) return
      session.send({ event: 'setUserPosition', x, y })
    },

    userLeave: () => {
      session.send({ event: 'userLeave' })
      session.close()
    },
  }
}
