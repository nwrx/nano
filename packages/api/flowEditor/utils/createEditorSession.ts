/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/todo-tag */
import type { Thread } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { ModuleFlowEditor } from '..'
import type { Flow } from '../../flow'
import type { Project } from '../../project'
import type { RegistryComponent } from '../../registry'
import type { User } from '../../user'
import type { Workspace } from '../../workspace'
import type { EditorSessionClientMessage } from './editorSessionClientMessage'
import type { EditorSessionServerMessage } from './editorSessionServerMessage'
import {
  abort,
  addLink,
  addNode,
  getNode,
  getNodeInputOptions,
  removeLink,
  removeNode,
  serialize,
  setNodeInputValue,
  setNodeMetadataValue,
} from '@nwrx/nano'
import { serializeSpecifier } from '@nwrx/nano/utils'
import { ModuleFlow } from '../../flow'
import { ModuleVault } from '../../vault'
import { serializeNode } from './serializeNode'
import { serializeSession } from './serializeSession'

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
    public options: EditorSessionOptions,
  ) {}

  owner: EditorSessionParticipant
  participants: EditorSessionParticipant[] = []
  componentsCache = new Map<string, RegistryComponent>()

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

  isSubscribed(peer: Peer) {
    return this.participants.some(p => p.peer?.id === peer.id)
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
    if (this.participants.length === 1) this.owner = newParticipant

    // --- Bind the peer to the participant.
    this.broadcast({
      event: 'user:join',
      id: peer.id,
      color: newParticipant.color,
      name: user.profile?.displayName ?? user.username,
    })

    // --- Send the flow session data to the peer.
    peer.send({
      event: 'init',
      data: await serializeSession(this, peer),
    })
  }

  unsubscribe(peer: Peer) {
    const peerToRemove = this.participants.find(p => p.peer?.id === peer.id)
    if (!peerToRemove) return

    // --- Remove the peer from the participants list.
    this.participants = this.participants.filter(p => p.peer?.id !== peer.id)
    this.broadcast({ event: 'user:leave', id: peer.id })

    // --- If there are no more peers, stop the flow.
    if (this.participants.length === 0) abort(this.thread)
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

  async onMessage(peer: Peer, message: EditorSessionClientMessage) {
    try {

      /***************************************************************************/
      /* Flow                                                                    */
      /***************************************************************************/

      if (message.event === 'setMetaValues') {
        for (const { name, value } of message.data) {
          // if (name === 'name') this.flow.name = value as string
          if (name === 'title') this.flow.title = value as string
          if (name === 'description') this.flow.description = value as string
          this.broadcast({ event: 'meta', name, value })
        }
        await this.save()
      }

      /***************************************************************************/
      /* Nodes                                                                   */
      /***************************************************************************/

      if (message.event === 'createNodes') {
        for (const { specifier, x, y } of message.data) {
          const id = addNode(this.thread, specifier, { metadata: { position: { x, y } } })
          const component = await serializeNode.call(this, id)
          this.broadcast({ event: 'node:created', id, component, x, y })
        }
        await this.save()
      }
      if (message.event === 'cloneNodes') {
        for (const { id, x, y } of message.data) {
          const { input, ...specifierObject } = getNode(this.thread, id)
          const specifier = serializeSpecifier(specifierObject)
          const newId = addNode(this.thread, specifier, { input, metadata: { position: { x, y } } })
          const component = await serializeNode.call(this, newId)
          this.broadcast({ event: 'node:created', id: newId, component, x, y })
        }
        await this.save()
      }
      if (message.event === 'removeNodes') {
        for (const id of message.data) {
          await removeNode(this.thread, id)
          this.broadcast({ event: 'node:removed', ids: [id] })
        }
        await this.save()
      }
      if (message.event === 'setNodesInputValue') {
        for (const { id, name, value } of message.data) {
          setNodeInputValue(this.thread, id, name, value)
          this.broadcast({ event: 'node:inputValueChanged', id, name, value })
        }
        await this.save()
      }
      if (message.event === 'setNodesInputVisibility') {
        for (const { id, name, visible } of message.data) {
          const { metadata = {} } = getNode(this.thread, id)
          const visibility = metadata.visibility ?? {}
          const newValue = { ...visibility, [name]: visible }
          setNodeMetadataValue(this.thread, id, 'visibility', newValue)
          this.broadcast({ event: 'node:metaValueChanged', id, name: 'visibility', value: newValue })
        }
        await this.save()
      }
      if (message.event === 'setNodesPosition') {
        for (const { id, x, y } of message.data) {
          setNodeMetadataValue(this.thread, id, 'position', { x, y })
          this.broadcast({ event: 'node:metaValueChanged', id, name: 'position', value: { x, y } })
        }
        await this.save()
      }
      if (message.event === 'setNodesLabel') {
        for (const { id, label } of message.data) {
          const value = label.trim() === '' ? undefined : label
          setNodeMetadataValue(this.thread, id, 'label', value)
          this.broadcast({ event: 'node:metaValueChanged', id, name: 'label', value })
        }
        await this.save()
      }
      if (message.event === 'setNodesComment') {
        for (const { id, comment } of message.data) {
          const value = comment.trim() === '' ? undefined : comment
          setNodeMetadataValue(this.thread, id, 'comment', value)
          this.broadcast({ event: 'node:metaValueChanged', id, name: 'comment', value })
        }
        await this.save()
      }

      /***************************************************************************/
      /* Links                                                                   */
      /***************************************************************************/

      if (message.event === 'createLink') {
        const [link] = message.data
        const { id, name, value } = await addLink(this.thread, link)
        this.broadcast({ event: 'node:inputValueChanged', id, name, value })
        this.broadcast({ event: 'node:linkCreated', data: [link] })
        await this.save()
      }

      if (message.event === 'removeLink') {
        const [link] = message.data
        const results = await removeLink(this.thread, link)
        for (const { id, name, value } of results) {
          this.broadcast({ event: 'node:inputValueChanged', id, name, value })
          this.broadcast({ event: 'node:linkRemoved', data: results })
        }
        await this.save()
      }

      /***************************************************************************/
      /* Requests                                                                */
      /***************************************************************************/

      if (message.event === 'searchVariables') {
        const [{ search }] = message.data
        const moduleVault = this.moduleFlow.getModule(ModuleVault)
        const variables = await moduleVault.searchVariableByProject({ project: this.project, search, withVault: true })
        peer.send({ event: 'searchVariablesResult', data: variables.map(x => x.serialize({ withVault: true })) } as EditorSessionServerMessage)
      }
      if (message.event === 'searchOptions') {
        const [{ id, name, query }] = message.data
        const data = await getNodeInputOptions(this.thread, id, name, query)
        peer.send({ event: 'searchOptionsResult', data } as EditorSessionServerMessage)
      }

      /***************************************************************************/
      /* User                                                                    */
      /***************************************************************************/

      if (message.event === 'setUserPosition') {
        const [x, y] = message.data
        this.broadcast({ event: 'user:position', id: peer.id, x, y }, peer)
      }
      if (message.event === 'userLeave')
        this.unsubscribe(peer)
    }

    /***************************************************************************/
    /* Error handling                                                          */
    /***************************************************************************/
    catch (error) {
      this.broadcast({ event: 'error', message: (error as Error).message })
      console.error(error)
    }
  }

  async save() {
    const moduleFlow = this.moduleFlow.getModule(ModuleFlow)
    const { Flow } = moduleFlow.getRepositories()
    this.flow.data = serialize(this.thread)
    await Flow.save(this.flow)
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
}
