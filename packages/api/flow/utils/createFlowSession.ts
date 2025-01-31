import type { User } from '@nwrx/api'
import type { FlowEvents, Flow as FlowInstance } from '@nwrx/core'
import type { Peer } from 'crossws'
import type { Repository } from 'typeorm'
import type { Flow } from '../entities'
import type { FlowNodeInstanceJSON } from './serializeFlowNodeInstance'
import type { FlowNodePortJSON } from './serializeFlowSchema'
import type { FlowSessionJSON } from './serializeFlowSession'
import { flowToJson } from '@nwrx/core'
import { serializeFlowNodeInstance } from './serializeFlowNodeInstance'
import { serializeFlowSchema } from './serializeFlowSchema'
import { serializeFlowSession } from './serializeFlowSession'

/**
 * A `FlowSessionParticipant` represents a peer that is subscribed to a flow session.
 * The peer is identified by its `Peer` instance and has a color and position
 * assigned to it so that the flow editor can display the peer in the UI.
 */
export interface FlowSessionParticipant {
  peer: Peer
  user: User
  color: string
  position: { x: number; y: number }
  selectedNodes: string[]
}

/**
 * The `FlowSessionEvents` type represents all possible events that can be
 * emitted by a `FlowSession`. Each event has a corresponding data type that
 * represents the data that is sent with the event.
 */
export interface FlowSessionEvents extends Record<keyof FlowEvents, unknown> {

  // Flow
  'flow:refresh': FlowSessionJSON
  'flow:metaValue': { key: string; value: unknown }
  'flow:input': { key: string; value: unknown }
  'flow:output': { key: string; value: unknown }
  'flow:abort': object
  'flow:start': object
  'flow:end': object

  // Variables
  'variables:create': { name: string; value: string }
  'variables:update': { name: string; value: string }
  'variables:remove': { name: string }

  // Secrets
  'secrets:create': { name: string; value: string }
  'secrets:update': { name: string; value: string }
  'secrets:remove': { name: string }

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

  // User
  'user:join': { id: string; name: string; color: string }
  'user:leave': { id: string }
  'user:position': { id: string; x: number; y: number }

  // Error
  error: { message: string }
}

/** The payload of a flow session event. */
export type FlowSessionPayload<K extends keyof FlowSessionEvents = keyof FlowSessionEvents> =
  { [P in K]: { event: P } & FlowSessionEvents[P] }[K]

export class FlowSession {

  /**
   * Instantiate a new `FlowSession` with the given flow.
   *
   * @param flow The flow to create the session for.
   * @param entity The flow entity as stored in the database.
   * @param repository The repository to save the flow entity to.
   */
  constructor(
    public flow: FlowInstance,
    public entity: Flow,
    public repository: Repository<Flow>,
  ) {

    // --- Flow events.
    this.flow.on('flow:metaValue', (key, value) => this.broadcast({ event: 'flow:metaValue', key, value }))
    this.flow.on('flow:input', (key, value) => this.broadcast({ event: 'flow:input', key, value }))
    this.flow.on('flow:output', (key, value) => this.broadcast({ event: 'flow:output', key, value }))
    this.flow.on('flow:start', () => this.broadcast({ event: 'flow:start' }))
    this.flow.on('flow:abort', () => this.broadcast({ event: 'flow:abort' }))
    this.flow.on('flow:end', () => this.broadcast({ event: 'flow:end' }))

    // --- Node events.
    this.flow.on('node:create', node => this.broadcast({ event: 'node:create', ...serializeFlowNodeInstance(node) }))
    this.flow.on('node:remove', id => this.broadcast({ event: 'node:remove', id }))
    this.flow.on('node:metaValue', (id, key, value) => this.broadcast({ event: 'node:metaValue', id, key, value }))
    this.flow.on('node:data', (id, data) => this.broadcast({ event: 'node:data', id, data }))
    this.flow.on('node:dataSchema', (id, schema) => this.broadcast({ event: 'node:dataSchema', id, schema: serializeFlowSchema(schema) }))
    this.flow.on('node:result', (id, result) => this.broadcast({ event: 'node:result', id, result }))
    this.flow.on('node:resultSchema', (id, schema) => this.broadcast({ event: 'node:resultSchema', id, schema: serializeFlowSchema(schema) }))
    this.flow.on('node:start', id => this.broadcast({ event: 'node:start', id }))
    this.flow.on('node:abort', id => this.broadcast({ event: 'node:abort', id }))
    this.flow.on('node:error', (id, error) => this.broadcast({ event: 'node:error', id, message: error.message }))
    this.flow.on('node:end', id => this.broadcast({ event: 'node:end', id }))
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
   * @param user The user that the peer represents.
   */
  subscribe(peer: Peer, user: User) {
    if (this.isSubscribed(peer)) return

    // --- If the participant is not found, throw an error.
    this.participants.push({
      peer,
      user,
      color: 'red',
      position: { x: 0, y: 0 },
      selectedNodes: [],
    })

    // --- Bind the peer to the participant.
    this.broadcast({
      event: 'user:join',
      id: peer.id,
      color: 'red',
      name: user.profile?.displayName ?? user.username,
    })

    // --- Send the flow session data to the peer.
    peer.send({
      event: 'flow:refresh',
      ...serializeFlowSession(this, peer),
    })
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
    this.broadcast({ event: 'user:leave', id: peer.id })

    // --- If there are no more peers, stop the flow.
    if (this.participants.length === 0) this.flow.abort()
  }

  /**
   * Broadcast a message to all subscribed peers.
   *
   * @param payload The payload to send to the peers.
   */
  broadcast<T extends keyof FlowSessionEvents>(payload: FlowSessionPayload<T>) {
    for (const participant of this.participants) {
      if (!participant.peer) continue
      participant.peer.send(payload)
    }
  }

  /**
   * Save the current state of the flow to the database. This will update the
   * flow entity with the latest data and meta information.
   */
  async save() {
    if (this.flow.meta.name) this.entity.title = this.flow.meta.name
    if (this.flow.meta.description) this.entity.description = this.flow.meta.description
    this.entity.data = flowToJson(this.flow)
    await this.repository.save(this.entity)
  }
}

/**
 * Create a new `FlowSession` with the given flow.
 *
 * @param flow The flow to create the session for.
 * @param entity The flow entity as stored in the database.
 * @param repository The repository to save the flow entity to.
 * @returns The new `FlowSession` instance.
 */
export function createFlowSession(flow: FlowInstance, entity: Flow, repository: Repository<Flow>): FlowSession {
  return new FlowSession(flow, entity, repository)
}
