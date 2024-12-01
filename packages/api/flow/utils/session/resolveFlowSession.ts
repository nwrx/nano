import type { ModuleFlow, User } from '@nwrx/api'
import type { Flow as FlowInstance } from '@nwrx/core'
import type { FlowThread } from '@nwrx/core'
import type { Peer } from 'crossws'
import type { Repository } from 'typeorm'
import type { Flow as FlowEntity } from '../../entities'
import type { FlowSessionEventMap, FlowSessionEventPayload } from './flowSessionEvents'
import type { FlowSessionMessage } from './flowSessionMessageSchema'
import { randomUUID } from 'node:crypto'
import { resolveFlowInstance } from '../resolveFlowInstance'
import { serializeFlowSession, serializeNode } from './serializeFlowSession'

export interface FlowSessionParticipant {
  peer: Peer
  user: User
  color: string
  position: { x: number; y: number }
  selectedNodes: string[]
}

export class FlowSessionInstance {
  constructor(
    public flow: FlowInstance,
    public thread: FlowThread,
    public entity: FlowEntity,
    public repository: Repository<FlowEntity>,
  ) {
    this.flow.on('createNode', async node => this.broadcast({ event: 'node:created', ...await serializeNode(this, node) }))
    this.flow.on('setNodeInputValue', ({ id }, key, value) => this.broadcast({ event: 'node:inputValueChanged', id, key, value }))
    this.thread.on('input', (name, value, meta) => this.broadcast({ event: 'thread:input', name, value, ...meta }))
    this.thread.on('output', (name, value, meta) => this.broadcast({ event: 'thread:output', name, value, ...meta }))
    this.thread.on('start', (input, meta) => this.broadcast({ event: 'thread:start', input, ...meta }))
    this.thread.on('abort', meta => this.broadcast({ event: 'thread:abort', ...meta }))
    this.thread.on('error', error => this.broadcast({ event: 'thread:error', code: error.name, message: error.message }))
    this.thread.on('end', (output, meta) => this.broadcast({ event: 'thread:end', output, ...meta }))
    this.thread.on('nodeState', ({ node: { id } }, meta) => this.broadcast({ event: 'thread:nodeState', id, ...meta }))
    this.thread.on('nodeError', ({ node: { id } }, error, meta) => this.broadcast({ event: 'thread:nodeError', id, code: error.name, message: error.message, context: error.context, ...meta }))
    this.thread.on('nodeTrace', ({ node: { id } }, data, meta) => this.broadcast({ event: 'thread:nodeTrace', id, data, ...meta }))
    this.thread.on('nodeStart', ({ node: { id } }, { input }, meta) => this.broadcast({ event: 'thread:nodeStart', id, input, ...meta }))
    this.thread.on('nodeEnd', ({ node: { id } }, { input, output }, meta) => this.broadcast({ event: 'thread:nodeEnd', id, input, output, ...meta }))

    // debug
    this.thread.on('nodeError', (_, error) => {
      error.name = error.name ?? 'Error'
      console.error(error)
    })
  }

  /** The peers that are subscribed to the session. */
  participants: FlowSessionParticipant[] = []

  /** The peer that is the owner of the session. */
  owner: FlowSessionParticipant

  /**
   * Check if the peer is already subscribed to the flow this.
   *
   * @param peer The peer to check.
   * @returns `true` if the peer is subscribed, `false` otherwise.
   */
  isSubscribed(peer: Peer) {
    return this.participants.some(p => p.peer?.id === peer.id)
  }

  /**
   * Subscribe a peer to the flow session with the given access token.
   *
   * @param peer The peer to subscribe.
   * @param user The user that the peer represents.
   */
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
      ...await serializeFlowSession(this, peer),
    })
  }

  /**
   * Unsubscribe a peer from the flow this.
   *
   * @param peer The peer to unsubscribe.
   */
  unsubscribe(peer: Peer) {
    const peerToRemove = this.participants.find(p => p.peer?.id === peer.id)
    if (!peerToRemove) return

    // --- Remove the peer from the participants list.
    this.participants = this.participants.filter(p => p.peer?.id !== peer.id)
    this.broadcast({ event: 'user:leave', id: peer.id })

    // --- If there are no more peers, stop the flow.
    if (this.participants.length === 0) this.thread.abort()
  }

  /**
   * Broadcast a message to all subscribed peers.
   *
   * @param payload The payload to send to the peers.
   * @param except The peer to exclude from the broadcast.
   */
  broadcast<T extends keyof FlowSessionEventMap>(payload: FlowSessionEventPayload<T>, except?: Peer) {
    for (const participant of this.participants) {
      if (!participant.peer) continue
      if (participant.peer.id === except?.id) continue

      // --- Before sending the payload, check if the payload contains a secret.
      // --- If so, replace the secret with a placeholder.
      // const payloadSecrets = Object.values(this.flow.variables)
      const payloadJson = JSON.stringify(payload)
      // for (const secret of payloadSecrets)
      //   payloadJson = payloadJson.replaceAll(secret, '********')
      const payloadSafe = JSON.parse(payloadJson) as FlowSessionEventPayload<T>

      participant.peer.send(payloadSafe)
    }
  }

  /**
   * Handle a message from a peer. This function is called when a peer sends a
   * message to the flow session WebSocket. The message is parsed and the event
   * is dispatched to the corresponding event handler.
   *
   * @param peer The peer that sent the message.
   * @param message The message that was sent by the peer.
   * @returns The response to the message.
   */
  async onMessage(peer: Peer, message: FlowSessionMessage) {
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
        const { key, value } = message
        if (key === 'name') this.entity.title = value as string
        if (key === 'description') this.entity.description = value as string
        this.broadcast({ event: 'meta', key, value })
        await this.save()
      }

      /***************************************************************************/
      /* Secrets & Variables                                                     */
      /***************************************************************************/

      /***************************************************************************/
      /* Nodes                                                                   */
      /***************************************************************************/

      if (message.event === 'createNode') {
        const { kind, x, y } = message
        this.flow.createNode({ kind, id: randomUUID(), meta: { position: { x, y } } })
        await this.save()
      }

      if (message.event === 'cloneNodes') {
        const { id, x, y } = message
        const node = this.flow.get(id)
        this.flow.createNode({ ...node, id: randomUUID(), meta: { position: { x, y } } })
        await this.save()
      }

      if (message.event === 'removeNodes') {
        const { ids } = message
        this.flow.removeNodes(...ids)
        this.broadcast({ event: 'node:removed', ids })
        await this.save()
      }

      if (message.event === 'setNodeInputValue') {
        const { id, key, value } = message
        this.flow.setNodeInputValue(id, key, value)
        this.broadcast({ event: 'node:inputValueChanged', id, key, value }, peer)
        await this.save()
      }

      if (message.event === 'setNodesPosition') {
        for (const { id, x, y } of message.positions) {
          this.flow.setNodesMetaValue(id, 'position', { x, y })
          this.broadcast({ event: 'node:metaValueChanged', id, key: 'position', value: { x, y } })
        }
        await this.save()
      }

      if (message.event === 'setNodeLabel') {
        const { id, label } = message
        const value = label.trim() === '' ? undefined : label
        this.flow.setNodesMetaValue(id, 'label', value)
        this.broadcast({ event: 'node:metaValueChanged', id, key: 'label', value })
        await this.save()
      }

      if (message.event === 'setNodeComment') {
        const { id, comment } = message
        const value = comment.trim() === '' ? undefined : comment
        this.flow.setNodesMetaValue(id, 'comment', value)
        this.broadcast({ event: 'node:metaValueChanged', id, key: 'comment', value })
        await this.save()
      }

      if (message.event === 'getInputValueOptions') {
        const { id, key, query } = message
        const options = await this.flow.getNodeInputValueOptions(id, key, query)
        peer.send({ event: 'node:inputOptionResult', id, key, options })
      }

      /***************************************************************************/
      /* Links                                                                   */
      /***************************************************************************/

      if (message.event === 'createLink') {
        await this.flow.createlink(message)
        await this.save()
      }

      if (message.event === 'removeLink') {
        const { id, name, path } = message
        await this.flow.removeLink({ sourceId: id, sourceName: name, sourcePath: path })
        await this.flow.removeLink({ targetId: id, targetName: name, targetPath: path })
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

  /**
   * Save the current state of the flow to the database. This will update the
   * flow entity with the latest data and meta information.
   */
  async save() {
    this.entity.data = this.flow.toJSON()
    await this.repository.save(this.entity)
  }

  /**
   * Returns an iterator of colors that can be used to assign to participants.
   * The colors are selected from a predefined list of colors.
   *
   * @yields The next color in the list.
   */
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

/**
 * Given an ID, create or get the `FlowSession` that corresponds to the ID of the flow.
 *
 * @param entity The flow to resolve the session for.
 * @returns The `FlowSession` that corresponds to the given ID.
 */
export function resolveFlowSession(this: ModuleFlow, entity: FlowEntity): FlowSessionInstance {

  // --- Check if the chain session is already in memory.
  // --- If so, return the chain session from memory.
  const exists = this.flowSessions.get(entity.id)
  if (exists) return exists

  // --- Create the flow session and store it in memory.
  const { Flow } = this.getRepositories()
  const flow = resolveFlowInstance.call(this, entity)
  const thread = flow.createThread()
  const session = new FlowSessionInstance(flow, thread, entity, Flow)
  this.flowSessions.set(entity.id, session)
  return session
}
