/* eslint-disable sonarjs/todo-tag */
import type { EditorSessionClientMessage, EditorSessionServerMessage, EditorState, ModuleFlowEditor } from '@nwrx/nano-api'
import type { SchemaOption } from '@nwrx/nano/utils'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
import { useAlerts } from '@unshared/vue/useAlerts'
import { useClient } from '~/composables/useClient'

export interface UseEditorSessionOptions {
  workspace: string
  project: string
  name: string
}

export const INITIAL_EDITOR_STATE: EditorState = {
  flow: { name: '', title: '', description: '' },
  nodes: [],
  participants: [],
}

export type EditorChannel = WebSocketChannel<ChannelConnectOptions<ModuleFlowEditor, 'WS /ws/workspaces/:workspace/projects/:project/flows/:name/editor'>>
export type EditorEventName = EditorSessionClientMessage['event']
export type EditorEventPayload<K extends EditorEventName> = EditorSessionClientMessage extends infer T ? T extends { event: K } ? T : never : never
export type EditorMethodParameters<K extends EditorEventName> = EditorEventPayload<K> extends { data: infer T extends any[] } ? T : []
export type EditorMethod<K extends EditorEventName> = (...data: EditorMethodParameters<K>) => void
export type EditorModel = ReturnType<typeof useEditorModel>

export function useEditorModel(options: UseEditorSessionOptions) {
  const client = useClient()
  const alerts = useAlerts()
  const state = ref(INITIAL_EDITOR_STATE) as Ref<EditorState>
  const messagesServer = ref([]) as Ref<EditorSessionServerMessage[]>
  const messagesClient = ref([]) as Ref<EditorSessionClientMessage[]>
  let channel: EditorChannel | undefined

  // --- Create a WebSocket channel to connect to the editor server. This allows us to
  // --- send and receive messages to and from the server to interact with the editor
  // --- while keeping the state of the editor in sync with the server when other users
  // --- make changes to the flow via the same editor session.
  async function connect() {
    channel = await client.connect('WS /ws/workspaces/:workspace/projects/:project/flows/:name/editor', {
      parameters: { ...options },
      onMessage: (message) => {
        messagesServer.value.push(message as EditorSessionServerMessage)

        /***************************************************************************/
        /* Flow                                                                    */
        /***************************************************************************/
        if (message.event === 'syncronize') {
          state.value = { ...state.value, ...message.data }
        }
        else if (message.event === 'error') {
          alerts.error(message.message)
        }
        else if (message.event === 'metadataChanged') {
          const { name, value } = message
          // @ts-expect-error: ignore
          state.value.flow[name] = value
        }

        /***************************************************************************/
        /* Nodes                                                                   */
        /***************************************************************************/
        else if (message.event === 'nodesCreated') {
          state.value.nodes.push(...message.data)
          state.value.nodes = [...state.value.nodes]
        }
        else if (message.event === 'nodesMetadataChanged') {
          for (const { id, name, value } of message.data) {
            const node = state.value.nodes.find(n => n.id === id)
            if (!node) return
            node.metadata[name] = value
          }
        }
        else if (message.event === 'nodesInputChanged') {
          for (const { id, name, value } of message.data) {
            const node = state.value.nodes.find(n => n.id === id)
            if (!node) return
            node.input[name] = value
          }
        }
        else if (message.event === 'nodesRemoved') {
          state.value.nodes = state.value.nodes.filter(n => !message.data.includes(n.id))
        }

        /***************************************************************************/
        /* Users                                                                   */
        /***************************************************************************/

        else if (message.event === 'userJoined') {
          for (const peer of message.data)
            state.value.participants.push({ ...peer, position: { x: 0, y: 0 } })
        }
        else if (message.event === 'usersPositionChanged') {
          for (const { id, x, y } of message.data) {
            const participant = state.value.participants.find(p => p.id === id)
            if (!participant) return
            participant.position = { x, y }
          }
        }
        else if (message.event === 'userLeft') {
          state.value.participants = state.value.participants.filter(p => !message.data.includes(p.id))
        }
      },
    })
  }

  function send<K extends EditorEventName>(event: K, ...data: EditorMethodParameters<K>) {
    if (!channel) return alerts.error('The editor is not connected to the server.')
    const message = { event, data } as EditorSessionClientMessage
    messagesClient.value.push(message)
    channel.send(message)
  }

  async function searchOptions(id: string, name: string, search: string) {
    send('searchOptions', { id, name, search })
    return new Promise<SchemaOption[]>((resolve) => {
      const stop = channel!.on('message', (message) => {
        if (message.event !== 'searchOptionsResult') return
        if (message.data[0].id !== id) return
        if (message.data[0].name !== name) return
        resolve(message.data[0].options)
        stop()
      })
    })
  }

  async function getFlowExport(format?: 'json' | 'yaml'): Promise<string> {
    send('getFlowExport', { format })
    return new Promise<string>((resolve) => {
      const stop = channel!.on('message', (message) => {
        if (message.event !== 'getFlowExportResult') return
        resolve(message.data[0])
        stop()
      })
    })
  }

  return {
    connect,
    send,
    searchOptions,
    getFlowExport,
    state,
    messagesServer,
    messagesClient,
    clearMessagesClient: () => messagesClient.value = [],
    clearMessagesServer: () => messagesServer.value = [],
  }
}
