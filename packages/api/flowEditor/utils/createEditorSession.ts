/* eslint-disable sonarjs/no-commented-code */
/* eslint-disable sonarjs/todo-tag */
import type { Thread } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { Flow } from '../../flow'
import type { Project } from '../../project'
import type { User } from '../../user'
import type { ModuleFlowEditor } from '../index'
import type { EditorSessionClientMessage } from './clientEvent'
import type { EditorSessionServerMessage } from './serverEvent'
import { serialize } from '@nwrx/nano'
import { ModuleFlow } from '../../flow'
import * as EventHandlers from './eventHandlers'
import { serializeSession } from './serialize'

export interface EditorSessionParticipant {
  peer: Peer
  user: User
  color: string
  position: { x: number; y: number }
}

export class EditorSession {
  constructor(
    public moduleFlowEditor: ModuleFlowEditor,
    public project: Project,
    public flow: Flow,
    public thread: Thread,
  ) {}

  /**
   * Saves the current flow specification to the database. This method serializes the
   * current thread's data and updates the flow object with the serialized data.
   *
   * @returns A promise that resolves when the flow is saved.
   */
  async saveFlow() {
    const moduleFlow = this.moduleFlowEditor.getModule(ModuleFlow)
    const { Flow } = moduleFlow.getRepositories()
    this.flow.data = serialize(this.thread)
    await Flow.save(this.flow)
  }

  /***************************************************************************/
  /* Subscriptions                                                           */
  /***************************************************************************/

  participants: EditorSessionParticipant[] = []

  isSubscribed(peer: Peer) {
    return this.participants.some(p => p.peer.id === peer.id)
  }

  subscribe(peer: Peer, user: User) {
    if (this.isSubscribed(peer)) return
    const color = this.getColor().next().value!

    this.participants.push({ peer, user, color, position: { x: 0, y: 0 } })

    // --- Bind the peer to the participant.
    this.broadcast({
      event: 'userJoined',
      data: [{ id: peer.id, color, name: user.profile?.displayName ?? user.username }],
    })

    // --- Send the flow session data to the peer.
    this.sendMessage(peer, {
      event: 'request.reload.result',
      data: serializeSession.call(this, peer),
    })
  }

  unsubscribe(peer: Peer) {
    this.participants = this.participants.filter(p => p.peer?.id !== peer.id)
    this.broadcast({ event: 'userLeft', data: [peer.id] })
  }

  sendMessage(peer: Peer, payload: EditorSessionServerMessage) {
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

  async handleMessage(peer: Peer, message: EditorSessionClientMessage) {
    try {

      // Misc
      if (message.event === 'request.reload') return EventHandlers.handleRequestReload.call(this, message, peer)
      if (message.event === 'request.export') return EventHandlers.handleExportRequest.call(this, message, peer)
      if (message.event === 'metadata.update') return EventHandlers.handleMetadataUpdate.call(this, message)

      // User
      if (message.event === 'user.move') return EventHandlers.handleUserMove.call(this, message, peer)
      if (message.event === 'user.leave') return EventHandlers.handleUserLeave.call(this, message, peer)

      // Nodes
      if (message.event === 'nodes.clone') return EventHandlers.handleNodesClone.call(this, message)
      if (message.event === 'nodes.create') return EventHandlers.handleNodesCreate.call(this, message)
      if (message.event === 'nodes.remove') return EventHandlers.handleNodesRemove.call(this, message, peer)
      if (message.event === 'nodes.input.update') return EventHandlers.handleNodesInputUpdate.call(this, message)
      if (message.event === 'nodes.links.create') return EventHandlers.handleNodesLinksCreate.call(this, message)
      if (message.event === 'nodes.links.remove') return EventHandlers.handleNodesLinksRemove.call(this, message)
      if (message.event === 'nodes.metadata.update') return EventHandlers.handleNodesMetadataUpdate.call(this, message)
      if (message.event === 'nodes.options.search') return EventHandlers.handleNodesOptionsSearch.call(this, message, peer)
    }
    catch (error) {
      this.sendMessage(peer, { event: 'error', message: (error as Error).message })
      console.error(error)
    }
  }
}
