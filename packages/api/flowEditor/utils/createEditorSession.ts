/* eslint-disable sonarjs/todo-tag */
import type { Thread } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { Repository } from 'typeorm'
import type { ModuleFlow } from '..'
import type { User } from '../../user'
import type { Flow } from '../entities'
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
import { serializeComponentInstance } from './serializeComponentInstance'
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

export class EditorSession {
  constructor(
    public moduleFlow: ModuleFlow,
    public thread: Thread,
    public flow: Flow,
    public repository: Repository<Flow>,
  ) {}

  /** The owner of the session. */
  owner: EditorSessionParticipant

  /** The participants of the session. */
  participants: EditorSessionParticipant[] = []

  /**
   * Check if the peer is already subscribed to the session. This is used to prevent
   * multiple subscriptions from the same peer.
   *
   * @param peer The peer to check if it is already subscribed.
   * @returns `true` if the peer is already subscribed, `false` otherwise.
   */
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

      if (message.event === 'setMetaValue') {
        const { name: key, value } = message
        if (key === 'name') this.flow.title = value as string
        if (key === 'description') this.flow.description = value as string
        this.broadcast({ event: 'meta', key, value })
        await this.save()
      }

      /***************************************************************************/
      /* Secrets & Variables                                                     */
      /***************************************************************************/

      // TODO: Implement secrets and variables

      /***************************************************************************/
      /* Nodes                                                                   */
      /***************************************************************************/

      if (message.event === 'createNode') {
        const { specifier, x, y } = message
        const id = addNode(this.thread, specifier, { metadata: { position: { x, y } } })
        const component = await serializeComponentInstance(this.thread, id)
        await this.save()
        this.broadcast({ event: 'node:created', id, component, x, y })
      }

      if (message.event === 'cloneNodes') {
        const { id, x, y } = message
        const { input, ...specifierObject } = getNode(this.thread, id)
        const specifier = serializeSpecifier(specifierObject)
        const newId = addNode(this.thread, specifier, { input, metadata: { position: { x, y } } })
        const component = await serializeComponentInstance(this.thread, newId)
        await this.save()
        this.broadcast({ event: 'node:created', id: newId, component, x, y })
      }

      if (message.event === 'removeNodes') {
        const { ids } = message
        await removeNode(this.thread, ...ids)
        this.broadcast({ event: 'node:removed', ids })
        await this.save()
      }

      if (message.event === 'setNodeInputValue') {
        const { id, name, value } = message
        setNodeInputValue(this.thread, id, name, value)
        this.broadcast({ event: 'node:inputValueChanged', id, name, value })
        await this.save()
      }

      if (message.event === 'setNodeInputVisibility') {
        const { id, name, visible } = message
        const { metadata: meta = {} } = getNode(this.thread, id)
        const visibility = meta.visibility ?? {}
        const newValue = { ...visibility, [name]: visible }
        setNodeMetadataValue(this.thread, id, 'visibility', newValue)
        this.broadcast({ event: 'node:metaValueChanged', id, name: 'visibility', value: newValue })
        await this.save()
      }

      if (message.event === 'setNodesPosition') {
        for (const { id, x, y } of message.positions) {
          setNodeMetadataValue(this.thread, id, 'position', { x, y })
          this.broadcast({ event: 'node:metaValueChanged', id, name: 'position', value: { x, y } })
        }
        await this.save()
      }

      if (message.event === 'setNodeLabel') {
        const { id, label } = message
        const value = label.trim() === '' ? undefined : label
        setNodeMetadataValue(this.thread, id, 'label', value)
        this.broadcast({ event: 'node:metaValueChanged', id, name: 'label', value })
        await this.save()
      }

      if (message.event === 'setNodeComment') {
        const { id, comment } = message
        const value = comment.trim() === '' ? undefined : comment
        setNodeMetadataValue(this.thread, id, 'comment', value)
        this.broadcast({ event: 'node:metaValueChanged', id, name: 'comment', value })
        await this.save()
      }

      if (message.event === 'getInputValueOptions') {
        const { id, name: key, query } = message
        const options = await getNodeInputOptions(this.thread, id, key, query)
        peer.send({ event: 'node:inputOptionResult', id, key, options })
      }

      /***************************************************************************/
      /* Links                                                                   */
      /***************************************************************************/

      if (message.event === 'createLink') {
        const { sourceId, sourceName, sourcePath, targetId, targetName, targetPath } = message
        const { id, name, value } = await addLink(this.thread, { sourceId, sourceName, sourcePath, targetId, targetName, targetPath })
        this.broadcast({ event: 'node:inputValueChanged', id, name, value })
        await this.save()
      }

      if (message.event === 'removeLink') {
        const { id, name, path } = message
        const results = await removeLink(this.thread, { sourceId: id, sourceName: name, sourcePath: path })
        for (const { id, name, value } of results) this.broadcast({ event: 'node:inputValueChanged', id, name, value })
        await this.save()
      }

      /***************************************************************************/
      /* User                                                                    */
      /***************************************************************************/

      if (message.event === 'setUserPosition') {
        const { x, y } = message
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
    this.flow.data = serialize(this.thread)
    await this.repository.save(this.flow)
  }

  private * getColor() {
    let index = 0
    const colors = ['#5636D9', '#F59E0B', '#D53B23', '#ADEF1F', '#5DB65A']
    while (true) {
      yield colors[index]
      if (index >= colors.length - 1) index = 0
      else index++
    }
  }
}
