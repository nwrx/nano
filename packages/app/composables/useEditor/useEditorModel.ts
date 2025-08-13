/* eslint-disable sonarjs/todo-tag */
import type { Editor, ModuleFlowEditor } from '@nwrx/nano-api'
import type { Schema, SchemaOption } from '@nwrx/nano/utils'
import type { LooseDeep } from '@unshared/types'
import { useAlerts } from '@unshared/vue/useAlerts'
import { useClient } from '~/composables/useClient'

export interface UseEditorModelOptions {
  workspace: string
  project: string
  flow: string
}

const INITIAL_EDITOR_STATE: Editor.State = {
  flow: { name: '', title: '', description: '' },
  nodes: [],
  participants: [],
}

export type MessageByEvent<K extends Editor.MessageClientEvent> = Editor.MessageClient extends infer T ? T extends { event: K } ? T : never : never
export type MessageData<K extends Editor.MessageClientEvent> = MessageByEvent<K> extends { data: infer T extends any[] } ? LooseDeep<T> : []
export interface EditorComponents { components: Editor.ComponentObject[]; groups: Editor.ComponentGroup[] }

export function useEditorModel(options: UseEditorModelOptions) {
  const { workspace, project, flow } = options
  const client = useClient<ModuleFlowEditor>()
  const alerts = useAlerts()
  const state = ref(INITIAL_EDITOR_STATE) as Ref<Editor.State>
  const components = ref([]) as Ref<Editor.ComponentObject[]>
  const componentGroups = ref([]) as Ref<Editor.ComponentGroup[]>

  // --- Create a WebSocket channel to connect to the editor server. This allows us to
  // --- send and receive messages to and from the server to interact with the editor
  // --- while keeping the state of the editor in sync with the server when other users
  // --- make changes to the flow via the same editor session.
  const channel = client.connect(
    'WS /api/workspaces/:workspace/projects/:project/flows/:flow/editor',
    {
      parameters: { workspace, project, flow },
      autoReconnect: true,
      reconnectDelay: 1000,
      reconnectLimit: 5,
      onMessage: (message: Editor.MessageServer) => {
        if (message.event ==='editor.error') {
          alerts.error({
            title: message.data.name,
            text: message.data.message,
          })
        }
        else if (message.event === 'metadata.changed') {
        // @ts-expect-error: `name` is a valid key in `Editor.State['flow']`.
          for (const { name, value } of message.data) state.value.flow[name] = value
        }
        else if (message.event === 'nodes.created') {
          state.value.nodes.push(...message.data)
          state.value.nodes = [...state.value.nodes]
        }
        else if (message.event === 'nodes.removed') {
          state.value.nodes = state.value.nodes.filter(n => !message.data.includes(n.id))
        }
        else if (message.event === 'nodes.input.changed') {
          for (const { id, name, value } of message.data) {
            const node = state.value.nodes.find(n => n.id === id)
            if (!node) return
            node.input[name] = value
          }
        }
        else if (message.event === 'nodes.metadata.changed') {
          for (const { id, name, value } of message.data) {
            const node = state.value.nodes.find(n => n.id === id)
            if (!node) return
            node.metadata[name] = value
          }
        }
        else if (message.event === 'user.joined') {
          for (const peer of message.data)
            state.value.participants.push({ ...peer, position: { x: 0, y: 0 } })
        }
        else if (message.event === 'user.moved') {
          for (const { id, x, y } of message.data) {
            const participant = state.value.participants.find(p => p.id === id)
            if (!participant) return
            participant.position = { x, y }
          }
        }
        else if (message.event === 'user.left') {
          state.value.participants = state.value.participants.filter(p => message.data.id !== p.id)
        }
        else if (message.event === 'request.reload.result') {
          state.value = { ...state.value, ...message.data }
        }
      },
    },
  )

  // --- Create a WebSocket channel to connect to the editor server. This allows us to
  // --- send and receive messages to and from the server to interact with the editor
  // --- while keeping the state of the editor in sync with the server when other users
  // --- make changes to the flow via the same editor session.
  async function connect() {
    if (!workspace || !project || !flow) return
    await channel.open()
  }

  function sendMessage<K extends Editor.MessageClientEvent>(event: K, ...data: MessageData<K>) {
    channel.send({ event, data })
  }

  tryOnScopeDispose(() => {
    void channel.close()
  })

  return toReactive({
    state,
    components,
    componentGroups,

    connect,
    sendMessage,

    fetchComponents: async() => {
      await client.requestAttempt(
        'GET /workspaces/:workspace/projects/:project/flows/:flow/components',
        {
          parameters: { workspace, project, flow },
          onData: (result) => {
            components.value = result.components
            componentGroups.value = result.groups
          },
        },
      )
    },

    searchOptions: async(id: string, name: string, search: string) => {
      sendMessage('nodes.options.search', { id, name, search })
      return new Promise<SchemaOption[]>((resolve) => {
        const stop = channel.on('message', (message: Editor.MessageServer) => {
          if (message.event !== 'nodes.options.result') return
          if (message.data[0].id !== id) return
          if (message.data[0].name !== name) return
          resolve(message.data[0].options)
          stop()
        })
      })
    },

    searchProperties: async(id: string, name: string, search: string) => {
      sendMessage('nodes.properties.search', { id, name, search })
      return new Promise<Record<string, Schema>>((resolve) => {
        const stop = channel.on('message', (message: Editor.MessageServer) => {
          if (message.event !== 'nodes.properties.result') return
          if (message.data[0].id !== id) return
          if (message.data[0].name !== name) return
          resolve(message.data[0].properties)
          stop()
        })
      })
    },

    requestExport: async(format: 'json' | 'yaml'): Promise<string> => {
      sendMessage('request.export', { format })
      return new Promise<string>((resolve) => {
        const stop = channel.on('message', (message: Editor.MessageServer) => {
          if (message.event !== 'request.export.result') return
          resolve(message.data)
          stop()
        })
      })
    },
  })
}
