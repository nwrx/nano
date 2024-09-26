import type { User } from '@nwrx/api'
import type { Flow as FlowInstance } from '@nwrx/core'
import type { Peer } from 'crossws'
import type { Flow } from '../entities'
import type { FlowNodeInstanceJSON } from './serializeFlowNodeInstance'
import type { FlowNodePortJSON } from './serializeFlowSchema'
import type { FlowSessionJSON } from './serializeFlowSession'
import { type FlowEvents, flowToJson } from '@nwrx/core'
import { randomBytes } from 'node:crypto'
import { serializeFlowNodeInstance } from './serializeFlowNodeInstance'
import { serializeFlowSchema } from './serializeFlowSchema'

/**
 * A `FlowSessionParticipant` represents a peer that is subscribed to a flow session.
 * The peer is identified by its `Peer` instance and has a color and position
 * assigned to it so that the flow editor can display the peer in the UI.
 */
export interface FlowSessionParticipant {
  peer?: Peer
  user: User
  color: string
  position: { x: number; y: number }
  selectedNodes: string[]
  accessToken: string
}

/**
 * The `FlowSessionEvents` type represents all possible events that can be
 * emitted by a `FlowSession`. Each event has a corresponding data type that
 * represents the data that is sent with the event.
 */
export interface FlowSessionEvents extends Record<keyof FlowEvents, unknown> {

  // Flow
  'flow:token': string
  'flow:refresh': FlowSessionJSON
  'flow:metaValue': { key: string; value: unknown }
  'flow:input': { key: string; value: unknown }
  'flow:output': { key: string; value: unknown }
  'flow:abort': void
  'flow:start': void
  'flow:end': void

  // Node
  'node:create': FlowNodeInstanceJSON
  'node:remove': { id: string }
  'node:metaValue': { id: string; key: string; value: unknown }
  'node:data': { id: string; data: Record<string, unknown> }
  'node:dataSchema': { id: string; schema: FlowNodePortJSON[] }
  'node:result': { id: string; result: Record<string, unknown> }
  'node:resultSchema': { id: string; schema: FlowNodePortJSON[] }
  'node:start': { id: string }
  'node:abort': { id: string }
  'node:error': { id: string; message: string }
  'node:end': { id: string }

  // Link
  'link:create': { source: string; target: string }
  'link:remove': { source: string; target: string }

  // User
  'user:join': { id: string; name: string; color: string }
  'user:leave': { id: string }
  'user:position': { id: string; x: number; y: number }

  // Error
  error: { message: string }
}

/** The payload of a flow session event. */
export type FlowSessionPayload = {
  [K in keyof FlowSessionEvents]: { event: K; data: FlowSessionEvents[K] }
}[keyof FlowSessionEvents]

export class FlowSession {

  /**
   * Instantiate a new `FlowSession` with the given flow.
   *
   * @param flow The flow to create the session for.
   * @param entity The flow entity as stored in the database.
   */
  constructor(
    public flow: FlowInstance,
    public entity: Flow,
  ) {

    // --- Flow events.
    this.flow.on('flow:metaValue', (key, value) => this.broadcast('flow:metaValue', { key, value }))
    this.flow.on('flow:input', (key, value) => this.broadcast('flow:input', { key, value }))
    this.flow.on('flow:output', (key, value) => this.broadcast('flow:output', { key, value }))
    this.flow.on('flow:start', () => this.broadcast('flow:start', void 0))
    this.flow.on('flow:abort', () => this.broadcast('flow:abort', void 0))
    this.flow.on('flow:end', () => this.broadcast('flow:end', void 0))

    // --- Node events.
    this.flow.on('node:create', node => this.broadcast('node:create', serializeFlowNodeInstance(node)))
    this.flow.on('node:remove', id => this.broadcast('node:remove', { id }))
    this.flow.on('node:metaValue', (id, key, value) => this.broadcast('node:metaValue', { id, key, value }))
    this.flow.on('node:data', (id, data) => this.broadcast('node:data', { id, data }))
    this.flow.on('node:dataSchema', (id, schema) => this.broadcast('node:dataSchema', { id, schema: serializeFlowSchema(schema) }))
    this.flow.on('node:result', (id, result) => this.broadcast('node:result', { id, result }))
    this.flow.on('node:resultSchema', (id, schema) => this.broadcast('node:resultSchema', { id, schema: serializeFlowSchema(schema) }))
    this.flow.on('node:start', id => this.broadcast('node:start', { id }))
    this.flow.on('node:abort', id => this.broadcast('node:abort', { id }))
    this.flow.on('node:error', (id, error) => this.broadcast('node:error', { id, message: error.message }))
    this.flow.on('node:end', id => this.broadcast('node:end', { id }))

    // --- Link events.
    this.flow.on('link:create', ({ source, target }) => this.broadcast('link:create', { source, target }))
    this.flow.on('link:remove', ({ source, target }) => this.broadcast('link:remove', { source, target }))
  }

  /** The peers that are subscribed to the flow session. */
  participants: FlowSessionParticipant[] = []

  /**
   * Check if the peer is already subscribed to the flow session.
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
   * @param accessToken The access token to use to authenticate the peer.
   */
  subscribe(peer: Peer, accessToken: string) {
    if (this.isSubscribed(peer)) return
    const participant = this.participants.find(p => p.accessToken === accessToken)

    // --- If the participant is not found, throw an error.
    if (!participant) throw new Error('Invalid access token.')

    // --- Bind the peer to the participant.
    participant.peer = peer
    this.broadcast('user:join', {
      id: peer.id,
      name: participant?.user.displayName,
      color: 'red',
    })
  }

  /**
   * Given an access token, prepare a `FlowSessionParticipant` for a future WebSocket connection
   * to bind the peer to the flow session. The access token is used to authenticate the
   * peer and to ensure that the peer has access to the flow session.
   *
   * @param user The user to create the access token for.
   * @returns The access token that the user can use to connect to the flow session.
   */
  createAccessToken(user: User) {
    const accessToken = randomBytes(32).toString('hex')
    this.participants.push({
      user,
      color: 'red',
      position: { x: 0, y: 0 },
      selectedNodes: [],
      accessToken,
    })
    return accessToken
  }

  /**
   * Unsubscribe a peer from the flow session.
   *
   * @param peer The peer to unsubscribe.
   */
  unsubscribe(peer: Peer) {
    const peerToRemove = this.participants.find(p => p.peer?.id === peer.id)
    if (!peerToRemove) return

    // --- Remove the peer from the participants list.
    this.participants = this.participants.filter(p => p.peer?.id !== peer.id)
    this.broadcast('user:leave', { id: peer.id })

    // --- If there are no more peers, stop the flow.
    if (this.participants.length === 0) this.flow.abort()
  }

  /**
   * Broadcast a message to all subscribed peers.
   *
   * @param event The event to broadcast.
   * @param data The data to broadcast.
   */
  broadcast<T extends keyof FlowSessionEvents>(event: T, data: FlowSessionEvents[T]) {
    for (const participant of this.participants) {
      if (!participant.peer) continue
      participant.peer.send({ event, data })
    }
  }

  /**
   * Save the current state of the flow to the database.
   */
  async save() {
    this.entity.title = this.flow.meta.name ?? 'Untitled Flow'
    // this.entity.icon = this.flow.icon
    this.entity.description = this.flow.meta.description ?? ''
    this.entity.data = flowToJson(this.flow)
    await this.entity.save()
  }
}

/**
 * Create a new `FlowSession` with the given flow.
 *
 * @param flow The flow to create the session for.
 * @param entity The flow entity as stored in the database.
 * @returns The new `FlowSession` instance.
 */
export function createFlowSession(flow: FlowInstance, entity: Flow): FlowSession {
  return new FlowSession(flow, entity)
}
