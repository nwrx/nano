/* eslint-disable sonarjs/no-commented-code */
/* eslint-disable sonarjs/todo-tag */
import type { Thread } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { FlowNodeObject, ModuleFlowEditor } from '..'
import type { Flow } from '../../flow'
import type { Project } from '../../project'
import type { User } from '../../user'
import type { Workspace } from '../../workspace'
import type { EditorSessionClientMessage } from './editorSessionClientMessage'
import type { EditorSessionServerMessage } from './editorSessionServerMessage'
import * as Nano from '@nwrx/nano'
import * as NanoUtils from '@nwrx/nano/utils'
import * as YAML from 'yaml'
import { ModuleFlow } from '../../flow'
import { ModuleVault } from '../../vault'
import { serializeSession, serializeSessionNode } from './serializeSession'

export interface EditorSessionParticipant {
  peer: Peer
  user: User
  color: string
  position: { x: number; y: number }
}

export interface EditorSessionOptions {
  thread: Thread
  flow: Flow
}

export interface EditorSessionOptions {
  thread: Thread
  flow: Flow
  project: Project
  workspace: Workspace
}

export class EditorSession {
  constructor(
    public moduleFlow: ModuleFlowEditor,
    private options: EditorSessionOptions,
  ) {}

  /***************************************************************************/
  /* Entities                                                                */
  /***************************************************************************/

  get thread() {
    return this.options.thread
  }

  get flow() {
    return this.options.flow
  }

  get project() {
    return this.options.project
  }

  get workspace() {
    return this.options.workspace
  }

  async save() {
    const moduleFlow = this.moduleFlow.getModule(ModuleFlow)
    const { Flow } = moduleFlow.getRepositories()
    this.flow.data = Nano.serialize(this.thread)
    await Flow.save(this.flow)
  }

  /***************************************************************************/
  /* Subscriptions                                                           */
  /***************************************************************************/

  participants: EditorSessionParticipant[] = []

  isSubscribed(peer: Peer) {
    return this.participants.some(p => p.peer.id === peer.id)
  }

  async subscribe(peer: Peer, user: User) {
    if (this.isSubscribed(peer)) return

    const newParticipant = {
      peer,
      user,
      color: this.getColor().next().value!,
      position: { x: 0, y: 0 },
      selectedNodes: [],
    }

    this.participants.push(newParticipant)

    // --- Bind the peer to the participant.
    this.broadcast({
      event: 'userJoined',
      data: [{
        id: peer.id,
        color: newParticipant.color,
        name: user.profile?.displayName ?? user.username,
      }],
    })

    // --- Send the flow session data to the peer.
    this.send(peer, {
      event: 'syncronize',
      data: await serializeSession(this, peer),
    })
  }

  unsubscribe(peer: Peer) {
    this.participants = this.participants.filter(p => p.peer?.id !== peer.id)
    this.broadcast({ event: 'userLeft', data: [peer.id] })
  }

  send(peer: Peer, payload: EditorSessionServerMessage) {
    peer.send(payload)
  }

  broadcast(payload: EditorSessionServerMessage, except?: Peer) {
    for (const participant of this.participants) {
      if (!participant.peer) continue
      if (participant.peer.id === except?.id) continue

      // --- Before sending the payload, check if the payload contains a secret.
      // --- If so, replace the secret with a placeholder.
      // const payloadSecrets = Object.values(this.flow.variables)
      const payloadJson = JSON.stringify(payload)
      // for (const secret of payloadSecrets)
      //   payloadJson = payloadJson.replaceAll(secret, '********')
      const payloadSafe = JSON.parse(payloadJson) as EditorSessionServerMessage
      participant.peer.send(payloadSafe)
    }
  }

  private * getColor() {
    let index = 0
    const colors = ['#5636f9', '#f59e0b', '#d53b23', '#adef1f', '#5db65a']
    while (true) {
      yield colors[index]
      if (index >= colors.length - 1) index = 0
      else index++
    }
  }

  /***************************************************************************/
  /* Websocket                                                               */
  /***************************************************************************/

  async handleMessage(peer: Peer, message: EditorSessionClientMessage) {
    try {

      /***************************************************************************/
      /* Flow                                                                    */
      /***************************************************************************/

      if (message.event === 'syncronize') {
        this.send(peer, {
          event: 'syncronize',
          data: await serializeSession(this, peer),
        })
      }
      else if (message.event === 'setMetadata') {
        for (const { name, value } of message.data) this.flow[name] = value
        this.broadcast({ event: 'metadataChanged', data: message.data })
        await this.save()
      }

      /***************************************************************************/
      /* Nodes                                                                   */
      /***************************************************************************/

      else if (message.event === 'createNodes') {
        const data: FlowNodeObject[] = []
        for (const { specifier, x, y } of message.data) {
          const id = Nano.addNode(this.thread, specifier, { metadata: { position: { x, y } } })
          const node = await serializeSessionNode(this, id)
          data.push(node)
        }
        this.broadcast({ event: 'nodesCreated', data })
        await this.save()
      }
      else if (message.event === 'cloneNodes') {
        const [{ ids, origin }] = message.data
        const data: FlowNodeObject[] = []

        // --- Find the left-top most node position.
        const sourceNodes = ids.map(id => this.thread.nodes.get(id)).filter(Boolean) as Nano.Node[]
        const sourcePositions = sourceNodes.map(node => node.metadata.position ?? { x: 0, y: 0 })
        const sourcePosition = {
          x: Math.min(...sourcePositions.map(p => p.x)),
          y: Math.min(...sourcePositions.map(p => p.y)),
        }

        for (const sourceNode of sourceNodes) {
          const specifier = NanoUtils.serializeSpecifier(sourceNode)
          const position = {
            x: origin.x + (sourceNode.metadata.position!.x - sourcePosition.x),
            y: origin.y + (sourceNode.metadata.position!.y - sourcePosition.y),
          }
          const id = Nano.addNode(this.thread, specifier, { input: sourceNode.input, metadata: { position } })
          const node = await serializeSessionNode(this, id)
          data.push(node)
        }
        this.broadcast({ event: 'nodesCreated', data })
        await this.save()
      }
      else if (message.event === 'removeNodes') {
        await Nano.removeNode(this.thread, ...message.data)
        this.broadcast({ event: 'nodesRemoved', data: message.data })
        await this.save()
      }
      else if (message.event === 'setNodesInputValue') {
        for (const { id, name, value } of message.data)
          Nano.setNodeInputValue(this.thread, id, name, value)
        this.broadcast({ event: 'nodesInputChanged', data: message.data })
        await this.save()
      }
      else if (message.event === 'setNodesMetadata') {
        for (const { id, name, value } of message.data)
          Nano.setNodeMetadataValue(this.thread, id, name, value)
        this.broadcast({ event: 'nodesMetadataChanged', data: message.data })
        await this.save()
      }

      /***************************************************************************/
      /* Links                                                                   */
      /***************************************************************************/

      else if (message.event === 'createLinks') {
        const [link] = message.data
        const { id, name, value } = await Nano.addLink(this.thread, link)
        this.broadcast({ event: 'nodesInputChanged', data: [{ id, name, value }] })
        await this.save()
      }
      else if (message.event === 'removeLinks') {
        const [link] = message.data
        const data = await Nano.removeLink(this.thread, link)
        this.broadcast({ event: 'nodesInputChanged', data })
        await this.save()
      }

      /***************************************************************************/
      /* User                                                                    */
      /***************************************************************************/

      else if (message.event === 'setUserPosition') {
        const [x, y] = message.data
        this.broadcast({ event: 'usersPositionChanged', data: [{ id: peer.id, x, y }] }, peer)
      }
      else if (message.event === 'userLeave') {
        this.unsubscribe(peer)
      }

      /***************************************************************************/
      /* Requests                                                                */
      /***************************************************************************/

      else if (message.event === 'getFlowExport') {
        const [{ format }] = message.data
        const data = Nano.serialize(this.thread, {
          name: this.flow.name,
          description: this.flow.description,
        })
        const formatted = format === 'json'
          ? JSON.stringify(data, undefined, 2)
          : YAML.stringify(data)
        this.send(peer, { event: 'getFlowExportResult', data: [formatted] })
      }
      else if (message.event === 'searchOptions') {
        const [{ id, name, search }] = message.data

        // --- If the input expects a Variable reference, search for the variables.
        const socket = await Nano.getNodeInputSocket(this.thread, id, name)
        if (socket['x-control'] === 'variable') {
          const moduleVault = this.moduleFlow.getModule(ModuleVault)
          const variables = await moduleVault.searchVariableByProject({ project: this.project, search, withVault: true })
          this.send(peer, {
            event: 'searchOptionsResult',
            data: [{
              id,
              name,
              options: variables.map(x => ({
                value: { $ref: `#/Variables/${x.vault?.name}/${x.name}` },
                label: `${x.vault?.name ?? 'Global'} / **${x.name}**`,
              })),
            }],
          } as EditorSessionServerMessage)
        }

        // --- Otherwise, search for the options in the component schema.
        else {
          const options = await Nano.getNodeInputOptions(this.thread, id, name, search)
          this.send(peer, { event: 'searchOptionsResult', data: [{ id, name, options }] })
        }
      }
    }

    /***************************************************************************/
    /* Error handling                                                          */
    /***************************************************************************/
    catch (error) {
      this.send(peer, { event: 'error', message: (error as Error).message })
      console.error(error)
    }
  }
}
