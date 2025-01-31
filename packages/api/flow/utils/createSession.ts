/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/todo-tag */
import type { Thread } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { Repository } from 'typeorm'
import type { ModuleFlow } from '..'
import type { User } from '../../user'
import type { Flow } from '../entities'
import type { EditorSessionClientMessage } from './editorSessionClientMessage'
import type { EditorSessionServerMessage } from './editorSessionServerMessage'
import { getComponentInstanceValueOptions, serializeThread } from '@nwrx/nano'
import { removeLink } from '@nwrx/nano'
import { add, remove } from '@nwrx/nano'
import { getInstance } from '@nwrx/nano'
import { setInputValue } from '@nwrx/nano'
import { setMetadataValue } from '@nwrx/nano'
import { createLink } from '@nwrx/nano'
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
  ) {

    this.thread.on('input', (name, value, meta) => this.broadcast({ event: 'thread:input', name, value, ...meta }))
    this.thread.on('output', (name, value, meta) => this.broadcast({ event: 'thread:output', name, value, ...meta }))
    this.thread.on('start', (input, meta) => this.broadcast({ event: 'thread:start', input, ...meta }))
    this.thread.on('abort', meta => this.broadcast({ event: 'thread:abort', ...meta }))
    this.thread.on('error', error => this.broadcast({ event: 'thread:error', code: error.name, message: error.message }))
    this.thread.on('end', (output, meta) => this.broadcast({ event: 'thread:end', output, ...meta }))

    // --- Node events
    this.thread.on('nodeState', (id, { nodeState }) => this.broadcast({ event: 'thread:nodeState', id, state: nodeState }))
    this.thread.on('nodeTrace', (id, data, meta) => this.broadcast({ event: 'thread:nodeTrace', id, data, ...meta }))
    this.thread.on('nodeStart', (id, { data }, meta) => this.broadcast({ event: 'thread:nodeStart', id, data, ...meta }))
    this.thread.on('nodeEnd', (id, { data, result }, meta) => this.broadcast({ event: 'thread:nodeEnd', id, data, result, ...meta }))
    this.thread.on('nodeError', (id, error, meta) => this.broadcast({
      event: 'thread:nodeError',
      id,
      name: error.name,
      message: error.message,
      context: error.context,
      ...meta,
    }))

    // debug
    this.thread.on('nodeError', (_, error) => {
      error.name = error.name ?? 'Error'
      console.error(error)
    })
  }

  owner: EditorSessionParticipant
  participants: EditorSessionParticipant[] = []

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
    if (this.participants.length === 0) this.thread.abort()
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
      /* Thread                                                                  */
      /***************************************************************************/

      if (message.event === 'start') await this.thread.start(message.input)
      if (message.event === 'abort') this.thread.abort()
      if (message.event === 'startNode') throw new Error('Not implemented')
      if (message.event === 'abortNode') throw new Error('Not implemented')

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
        const { kind, x, y } = message
        const id = add(this.thread, { specifier: kind, metadata: { position: { x, y } } })
        const component = await serializeComponentInstance(this.thread, id)
        await this.save()
        this.broadcast({ event: 'node:created', id, component, x, y })
      }

      if (message.event === 'cloneNodes') {
        const { id, x, y } = message
        const { specifier: kind, input } = getInstance(this.thread, id)
        const newId = add(this.thread, { specifier: kind, input, metadata: { position: { x, y } } })
        const component = await serializeComponentInstance(this.thread, newId)
        await this.save()
        this.broadcast({ event: 'node:created', id: newId, component, x, y })
      }

      if (message.event === 'removeNodes') {
        const { ids } = message
        remove(this.thread, ...ids)
        this.broadcast({ event: 'node:removed', ids })
        await this.save()
      }

      if (message.event === 'setNodeInputValue') {
        const { id, name, value } = message
        setInputValue(this.thread, id, name, value)
        this.broadcast({ event: 'node:inputValueChanged', id, name, value })
        await this.save()
      }

      if (message.event === 'setNodeInputVisibility') {
        const { id, name, visible } = message
        const { metadata: meta = {} } = getInstance(this.thread, id)
        const visibility = meta.visibility ?? {}
        const newValue = { ...visibility, [name]: visible }
        setMetadataValue(this.thread, id, 'visibility', newValue)
        this.broadcast({ event: 'node:metaValueChanged', id, name: 'visibility', value: newValue })
        await this.save()
      }

      if (message.event === 'setNodesPosition') {
        for (const { id, x, y } of message.positions) {
          setMetadataValue(this.thread, id, 'position', { x, y })
          this.broadcast({ event: 'node:metaValueChanged', id, name: 'position', value: { x, y } })
        }
        await this.save()
      }

      if (message.event === 'setNodeLabel') {
        const { id, label } = message
        const value = label.trim() === '' ? undefined : label
        setMetadataValue(this.thread, id, 'label', value)
        this.broadcast({ event: 'node:metaValueChanged', id, name: 'label', value })
        await this.save()
      }

      if (message.event === 'setNodeComment') {
        const { id, comment } = message
        const value = comment.trim() === '' ? undefined : comment
        setMetadataValue(this.thread, id, 'comment', value)
        this.broadcast({ event: 'node:metaValueChanged', id, name: 'comment', value })
        await this.save()
      }

      if (message.event === 'getInputValueOptions') {
        const { id, name: key, query } = message
        const options = await getComponentInstanceValueOptions(this.thread, id, key, query)
        peer.send({ event: 'node:inputOptionResult', id, key, options })
      }

      /***************************************************************************/
      /* Links                                                                   */
      /***************************************************************************/

      if (message.event === 'createLink') {
        const { id, name, value } = await createLink(this.thread, message)
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
    this.flow.data = serializeThread(this.thread)
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
