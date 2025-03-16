/* eslint-disable sonarjs/todo-tag */
import type { EditorSessionClientMessage, EditorSessionObject, ModuleFlowEditor } from '@nwrx/nano-api'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
import type { EditorView } from '#imports'
import { useAlerts, useClient } from '#imports'

export interface UseEditorSessionOptions {
  workspace: string
  project: string
  name: string
}

export const INITIAL_EDITOR_SESSION: EditorSessionObject = {
  name: '',
  title: '',
  icon: '',
  description: '',
  nodes: [],
  links: [],
  events: [],
  secrets: [],
  variables: [],
  isRunning: false,
  peers: [],
  peerId: '',
}

export type EditorChannel = WebSocketChannel<ChannelConnectOptions<ModuleFlowEditor, 'WS /ws/workspaces/:workspace/projects/:project/flows/:name/editor'>>
export type EditorEventName = EditorSessionClientMessage['event']
export type EditorEventPayload<K extends EditorEventName> = EditorSessionClientMessage extends infer T ? T extends { event: K } ? T : never : never
export type EditorMethodParameters<K extends EditorEventName> = EditorEventPayload<K> extends { data: infer T extends any[] } ? T : []
export type EditorMethod<K extends EditorEventName> = (...data: EditorMethodParameters<K>) => void
export type EditorModel = Readonly<EditorSessionObject> & { [K in EditorEventName]: EditorMethod<K> }

export interface Editor {
  model: EditorModel
  view: EditorView
  channel: EditorChannel
  options: UseEditorSessionOptions

}

export async function useEditor(options: UseEditorSessionOptions): Promise<Editor> {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref(INITIAL_EDITOR_SESSION) as Ref<EditorSessionObject>

  // --- Create a WebSocket channel to connect to the editor server. This allows us to
  // --- send and receive messages to and from the server to interact with the editor
  // --- while keeping the state of the editor in sync with the server when other users
  // --- make changes to the flow via the same editor session.
  const channel = await client.connect('WS /ws/workspaces/:workspace/projects/:project/flows/:name/editor', {
    parameters: { ...options },
    onMessage: (payload) => {
      switch (payload.event) {

        // Flow
        case 'init': {
          data.value = { ...data.value, ...payload.data }
          break
        }
        case 'error': {
          alerts.error(payload.message)
          break
        }
        case 'meta': {
          const { name, value } = payload
          if (name === 'name') data.value.name = value as string
          if (name === 'title') data.value.title = value as string
          if (name === 'icon') data.value.icon = value as string
          if (name === 'description') data.value.description = value as string
          break
        }

        // Nodes
        case 'node:created': {
          const { component } = payload
          data.value.nodes.push(component)
          data.value.nodes = [...data.value.nodes]
          break
        }
        case 'node:metaValueChanged': {
          const { id, name, value } = payload
          const node = data.value.nodes.find(n => n.id === id)
          if (!node) return console.warn('node not found', id)
          if (name === 'label') node.label = value as string
          if (name === 'comment') node.comment = value as string
          if (name === 'position') node.position = value as { x: number; y: number }
          break
        }
        case 'node:inputValueChanged': {
          const { id, name, value } = payload
          const node = data.value.nodes.find(n => n.id === id)
          if (!node) return
          node.input[name] = value
          break
        }
        case 'node:removed': {
          const { ids } = payload
          data.value.nodes = data.value.nodes.filter(n => !ids.includes(n.id))
          break
        }

        // Links
        case 'node:linkCreated': {
          data.value.links.push(payload.data[0])
          break
        }
        case 'node:linkRemoved': {
          const { data: [...links] } = payload
          data.value.links = data.value.links.filter(l => !links.some(link => link.id === l.targetId && link.name === l.targetName))
          break
        }

        // Users
        case 'user:join': {
          const peer = payload
          if (peer.id === data.value.peerId) return
          data.value.peers.push({ ...peer, position: { x: 0, y: 0 } })
          break
        }
        case 'user:position': {
          const { id, x, y } = payload
          const peer = data.value.peers.find(p => p.id === id)
          if (!peer) return
          peer.position = { x, y }
          break
        }
        case 'user:leave': {
          const { id } = payload
          data.value.peers = data.value.peers.filter(p => p.id !== id)
          break
        }
      }
    },
  })

  const model = new Proxy({}, {
    get(_, property) {
      if (property === 'then') return
      if (property === 'catch') return
      if (property in data.value) return data.value[property as keyof EditorSessionObject]
      // @ts-expect-error: event name mismatch is handled by the server.
      return (...data: any[]) => channel.send({ event: property, data })
    },
  }) as unknown as EditorModel

  // --- Initialize the editor view. This allows us to interact with the Vue components
  // --- that are part of the editor and handle its state and events based on the model.
  const view = useEditorView(model)
  return { model, view, channel, options }
}
