import type { ModuleFlow, User } from '@nwrx/api'
import type { FlowEventMeta, FlowEvents, Flow as FlowInstance, NodeEventMeta, NodeInstance } from '@nwrx/core'
import type { Peer } from 'crossws'
import type { Repository } from 'typeorm'
import type { Flow } from '../entities'
import type { DataSocketJSON } from './serializeDataSchema'
import type { FlowSessionJSON } from './serializeFlowSession'
import type { NodeInstanceJSON } from './serializeNodeInstance'
import type { ResultSocketJSON } from './serializeResultSchema'
import { flowFromJsonV1, flowToJson } from '@nwrx/core'
import { default as Core } from '@nwrx/module-core'
import { serializeDataSchema } from './serializeDataSchema'
import { serializeFlowSession } from './serializeFlowSession'
import { serializeNodeInstance } from './serializeNodeInstance'
import { serializeResultSchema } from './serializeResultSchema'

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
 * The `FlowSessionEventMap` type represents all possible events that can be
 * emitted by a `FlowSession`. Each event has a corresponding data type that
 * represents the data that is sent with the event.
 */
export interface FlowSessionEventMap extends Record<keyof FlowEvents, unknown> {

  // Flow
  'flow:refresh': FlowSessionJSON
  'flow:metaValue': { key: string; value: unknown }
  'flow:input': { name: string; value: unknown } & FlowEventMeta
  'flow:output': { name: string; value: unknown } & FlowEventMeta

  // Flow lifecycle
  'flow:start': { input: Record<string, unknown> } & FlowEventMeta
  'flow:end': { output: Record<string, unknown> } & FlowEventMeta
  'flow:abort': { output: Record<string, unknown> } & FlowEventMeta

  // Variables
  'variables:create': { name: string; value: string }
  'variables:update': { name: string; value: string }
  'variables:remove': { name: string }

  // Secrets
  'secrets:create': { name: string; value: string }
  'secrets:update': { name: string; value: string }
  'secrets:remove': { name: string }

  // Node
  'node:create': NodeInstanceJSON
  'node:remove': { id: string }
  'node:metaValue': { id: string; key: string; value: unknown }
  'node:data': { id: string; data: Record<string, unknown> }
  'node:dataSchema': { id: string; schema: DataSocketJSON[] }
  'node:result': { id: string; result: Record<string, unknown> }
  'node:resultSchema': { id: string; schema: ResultSocketJSON[] }

  // Node lifecycle
  'node:start': { id: string; data: Record<string, unknown> } & NodeEventMeta
  'node:end': { id: string; data: Record<string, unknown>; result: Record<string, unknown> } & NodeEventMeta
  'node:abort': { id: string } & NodeEventMeta
  'node:error': { id: string; message: string } & NodeEventMeta

  // User
  'user:join': { id: string; name: string; color: string }
  'user:leave': { id: string }
  'user:position': { id: string; x: number; y: number }

  // Error
  error: { message: string }
}

/** The name of an event that can be emitted by a flow session. */
export type FlowSessionEventName = keyof FlowSessionEventMap

/** The payload of a flow session event. */
export type FlowSessionEventPayload<K extends keyof FlowSessionEventMap = keyof FlowSessionEventMap> =
  { [P in K]: { event: P } & FlowSessionEventMap[P] }[K]

export class FlowSessionInstance {

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
    this.flow.on('flow:input', (name, value, meta) => this.broadcast({ event: 'flow:input', name, value, ...meta }))
    this.flow.on('flow:output', (name, value, meta) => this.broadcast({ event: 'flow:output', name, value, ...meta }))

    // --- Flow lifecycle events.
    this.flow.on('flow:start', (input, meta) => this.broadcast({ event: 'flow:start', input, ...meta }))
    this.flow.on('flow:abort', (output, meta) => this.broadcast({ event: 'flow:abort', output, ...meta }))
    this.flow.on('flow:end', (output, meta) => this.broadcast({ event: 'flow:end', output, ...meta }))

    // --- Node events.
    this.flow.on('node:create', node => this.broadcast({ event: 'node:create', ...serializeNodeInstance(node as NodeInstance) }))
    this.flow.on('node:remove', ({ id }) => this.broadcast({ event: 'node:remove', id }))
    this.flow.on('node:metaValue', ({ id }, key, value) => this.broadcast({ event: 'node:metaValue', id, key, value }))
    this.flow.on('node:dataRaw', ({ id }, data) => this.broadcast({ event: 'node:data', id, data }))
    this.flow.on('node:dataSchema', ({ id }, schema) => this.broadcast({ event: 'node:dataSchema', id, schema: serializeDataSchema(schema) }))
    this.flow.on('node:result', ({ id }, result) => this.broadcast({ event: 'node:result', id, result }))
    this.flow.on('node:resultSchema', ({ id }, schema) => this.broadcast({ event: 'node:resultSchema', id, schema: serializeResultSchema(schema) }))

    // --- Node lifecycle events.
    this.flow.on('node:start', ({ id }, data, meta) => this.broadcast({ event: 'node:start', id, data, ...meta }))
    this.flow.on('node:end', ({ id }, data, result, meta) => this.broadcast({ event: 'node:end', id, data, result, ...meta }))
    this.flow.on('node:abort', ({ id }, meta) => this.broadcast({ event: 'node:abort', id, ...meta }))
    this.flow.on('node:error', ({ id }, error, meta) => this.broadcast({ event: 'node:error', id, message: error.message, ...meta }))
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
   * @param except The peer to exclude from the broadcast.
   */
  broadcast<T extends keyof FlowSessionEventMap>(payload: FlowSessionEventPayload<T>, except?: Peer) {
    for (const participant of this.participants) {
      if (!participant.peer) continue
      if (participant.peer.id === except?.id) continue

      // --- Before sending the payload, check if the payload contains a secret.
      // --- If so, replace the secret with a placeholder.
      const payloadSecrets = Object.values(this.flow.variables)
      let payloadJson = JSON.stringify(payload)
      for (const secret of payloadSecrets)
        payloadJson = payloadJson.replaceAll(secret, '********')
      const payloadSafe = JSON.parse(payloadJson) as FlowSessionEventPayload<T>

      participant.peer.send(payloadSafe)
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
 * Given an ID, create or get the `FlowSession` that corresponds to the ID of the flow.
 *
 * @param flow The flow to resolve the session for.
 * @returns The `FlowSession` that corresponds to the given ID.
 */
export async function resolveFlowSession(this: ModuleFlow, flow: Flow): Promise<FlowSessionInstance> {

  // --- Check if the chain session is already in memory.
  // --- If so, return the chain session from memory.
  const exists = this.flowSessions.get(flow.id)
  if (exists) return exists

  // --- Assert the flow has a project and the project has secrets and variables.
  if (!flow.project) throw new Error('The project of the flow is not loaded.')
  if (!flow.project.secrets) throw new Error('The secrets of the project are not loaded.')
  if (!flow.project.variables) throw new Error('The variables of the project are not loaded.')

  // --- Create the flow instance.
  const flowInstance = flowFromJsonV1(flow.data, [Core])
  flowInstance.meta.name = flow.title
  flowInstance.meta.description = flow.description
  for (const secret of flow.project.secrets) flowInstance.secrets[secret.name] = secret.cipher
  for (const variable of flow.project.variables) flowInstance.variables[variable.name] = variable.value

  // --- Resolve all the nodes in the flow.
  for (const node of flowInstance.nodes) {
    await node.resolveDataSchema()
    await node.resolveDataSchema()
    await node.resolveResultSchema()
  }

  // --- Create the flow session and store it in memory.
  const { Flow } = this.getRepositories()
  const session = new FlowSessionInstance(flowInstance, flow, Flow)
  this.flowSessions.set(flow.id, session)
  return session
}
