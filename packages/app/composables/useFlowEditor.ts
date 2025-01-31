/* eslint-disable sonarjs/todo-tag */
/* eslint-disable sonarjs/cognitive-complexity */
import type { EditorSessionJSON, EditorSessionServerMessage, LinkJSON } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'
import { useAlerts, useClient } from '#imports'

export function useFlowEditor(workspace: MaybeRef<string>, project: MaybeRef<string>, name: MaybeRef<string>) {
  const client = useClient()
  const alerts = useAlerts()
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
  }) as EditorSessionJSON

  const channel = client.connect('WS /ws/workspaces/:workspace/:project/:name/editor', {
    parameters: {
      workspace: unref(workspace),
      project: unref(project),
      name: unref(name),
    },
    // @ts-expect-error: TODO: Fix this in @unserved/*
    onMessage: (payload: EditorSessionServerMessage) => {
      data.events = [...data.events, payload]
      switch (payload.event) {
        case 'init': {
          data.name = payload.data.name
          data.icon = payload.data.icon
          data.description = payload.data.description
          data.nodes = payload.data.nodes
          data.categories = payload.data.categories
          data.secrets = payload.data.secrets
          data.variables = payload.data.variables
          data.isRunning = payload.data.isRunning
          data.peers = payload.data.peers.filter(p => p.id !== data.peerId)
          data.peerId = payload.data.peerId
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
          const { id, result } = payload
          const node = data.nodes.find(n => n.id === id)
          if (!node) return
          node.output = result as Record<string, unknown>
          data.nodes = [...data.nodes]
          break
        }
        case 'thread:nodeError': {
          const { id, name, message, context } = payload
          const node = data.nodes.find(n => n.id === id)
          if (!node) return console.warn('node not found', id, data.nodes.map(n => n.id))
          node.error = message
          node.errorName = name
          node.errorContext = context as Record<string, unknown>
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
          const { component } = payload
          data.nodes.push(component)
          data.nodes = [...data.nodes]
          break
        }
        case 'node:metaValueChanged': {
          const { id, name, value } = payload
          const node = data.nodes.find(n => n.id === id)
          if (!node) return console.warn('node not found', id)
          if (name === 'label') node.label = value as string
          if (name === 'comment') node.comment = value as string
          if (name === 'position') node.position = value as { x: number; y: number }
          break
        }
        case 'node:inputValueChanged': {
          const { id, name, value } = payload
          const node = data.nodes.find(n => n.id === id)
          if (!node) return
          node.input[name] = value
          break
        }
        case 'node:inputOptionResult': {
          const { id, name, options } = payload
          const node = data.nodes.find(n => n.id === id)
          if (!node) return
          const socket = node.inputSchema?.find(s => s.key === name)
          if (!socket) return
          socket.options = options as unknown as SocketListOption[]
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
    },
  })

  return {
    data,
    channel,
    clearEvents: () => data.events = [],

    /***************************************************************************/
    /* Thread                                                                  */
    /***************************************************************************/

    start: (input: Record<string, unknown>) => {
      channel.send({ event: 'start', input })
    },

    abort: () => {
      channel.send({ event: 'abort' })
    },

    startNode: (id: string) => {
      channel.send({ event: 'startNode', id })
    },

    abortNode: (id: string) => {
      channel.send({ event: 'abortNode', id })
    },

    /***************************************************************************/
    /* Flow                                                                    */
    /***************************************************************************/

    setName: (name: string) => {
      channel.send({ event: 'setMetaValue', name: 'name', value: name })
    },

    setDescription: (description: string) => {
      channel.send({ event: 'setMetaValue', name: 'description', value: description })
    },

    /***************************************************************************/
    /* Secrets & Variables                                                     */
    /***************************************************************************/

    createVariable: (name: string, value: string) => {
      channel.send({ event: 'createVariable', name, value })
    },

    updateVariable: (name: string, value: string) => {
      channel.send({ event: 'updateVariable', name, value })
    },

    removeVariable: (name: string) => {
      channel.send({ event: 'removeVariable', name })
    },

    createSecret: (name: string, value: string) => {
      channel.send({ event: 'createSecret', name, value })
    },

    updateSecret: (name: string, value: string) => {
      channel.send({ event: 'updateSecret', name, value })
    },

    removeSecret: (name: string) => {
      channel.send({ event: 'removeSecret', name })
    },

    /***************************************************************************/
    /* Nodes                                                                   */
    /***************************************************************************/

    createNode: (kind: string, x: number, y: number) => {
      channel.send({ event: 'createNode', kind, x, y })
    },

    cloneNodes: (id: string, x: number, y: number) => {
      channel.send({ event: 'cloneNodes', id, x, y })
    },

    removeNodes: (ids: string[]) => {
      channel.send({ event: 'removeNodes', ids })
    },

    setNodesPosition: (positions: FlowNodePosition[]) => {
      channel.send({
        event: 'setNodesPosition',
        positions: positions.map(({ id, x, y }) => ({
          id,
          x: Math.round(x),
          y: Math.round(y),
        })),
      })
    },

    setNodeLabel: (id: string, label: string) => {
      channel.send({ event: 'setNodeLabel', id, label })
    },

    setNodeComment: (id: string, comment: string) => {
      channel.send({ event: 'setNodeComment', id, comment })
    },

    setNodeInputValue: (id: string, name: string, value: unknown) => {
      channel.send({ event: 'setNodeInputValue', id, name, value })
    },

    getNodeInputOptions: async(id: string, name: string, query?: string): Promise<SocketListOption[]> => {
      const promise = new Promise<SocketListOption[]>((resolve, reject) => {
        // @ts-expect-error: TODO: Fix this in @unserved/*
        const stop = channel.on('message', (payload: EditorSessionServerMessage) => {
          if (payload.event === 'error') reject(new Error(payload.message))
          if (payload.event !== 'node:inputOptionResult') return
          resolve(payload.options as unknown as SocketListOption[])
          stop()
        })
      })
      channel.send({ event: 'getInputValueOptions', id, name, query })
      return await promise
    },

    /***************************************************************************/
    /* Links                                                                   */
    /***************************************************************************/

    createLink: (source: LinkJSON, target: LinkJSON) => {
      channel.send({
        event: 'createLink',
        sourceId: source.id,
        sourceName: source.name,
        sourcePath: source.path,
        targetId: target.id,
        targetName: target.name,
        targetPath: target.path,
      })
    },

    removeLink: (link: LinkJSON) => {
      channel.send({ event: 'removeLink', id: link.id, name: link.name, path: link.path })
    },

    /***************************************************************************/
    /* User                                                                    */
    /***************************************************************************/

    setUserPosition: (x: number, y: number) => {
      if (data.peers.length < 2) return
      channel.send({ event: 'setUserPosition', x, y })
    },

    userLeave: () => {
      channel.send({ event: 'userLeave' })
      void channel.close()
    },
  }
}
