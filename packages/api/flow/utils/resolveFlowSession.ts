import type { ModuleFlow, User } from '@nwrx/api'
import type { FlowEventMeta, FlowEvents, Flow as FlowInstance, NodeEventMeta } from '@nwrx/core'
import type { Peer } from 'crossws'
import type { Repository } from 'typeorm'
import type { Flow as FlowEntity } from '../entities'
import type { FlowSessionMessage } from './flowSessionMessageSchema'
import type { DataSocketJSON } from './serializeDataSchema'
import type { FlowSessionJSON } from './serializeFlowSession'
import type { NodeInstanceJSON } from './serializeNodeInstance'
import type { ResultSocketJSON } from './serializeResultSchema'
import { flowToJson } from '@nwrx/core'
import { serializeDataSchema } from './serializeDataSchema'
import { serializeFlowSession } from './serializeFlowSession'
import { serializeNodeInstance } from './serializeNodeInstance'
import { serializeResultSchema } from './serializeResultSchema'

/**
 * A `FlowSessionParticipant` represents a peer that is subscribed to a flow this.
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
  'flow:meta': { key: string; value: unknown }
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
  'node:meta': { id: string; key: string; value: unknown }
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

/** The name of an event that can be emitted by a flow this. */
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
    public entity: FlowEntity,
    public repository: Repository<FlowEntity>,
  ) {

    // --- Flow events.
    this.flow.on('flow:meta', (key, value) => this.broadcast({ event: 'flow:meta', key, value }))
    this.flow.on('flow:input', (name, value, meta) => this.broadcast({ event: 'flow:input', name, value, ...meta }))
    this.flow.on('flow:output', (name, value, meta) => this.broadcast({ event: 'flow:output', name, value, ...meta }))

    // --- Flow lifecycle events.
    this.flow.on('flow:start', (input, meta) => this.broadcast({ event: 'flow:start', input, ...meta }))
    this.flow.on('flow:abort', (output, meta) => this.broadcast({ event: 'flow:abort', output, ...meta }))
    this.flow.on('flow:end', (output, meta) => this.broadcast({ event: 'flow:end', output, ...meta }))

    // --- Node events.
    this.flow.on('node:create', node => this.broadcast({ event: 'node:create', ...serializeNodeInstance(node) }))
    this.flow.on('node:remove', ({ id }) => this.broadcast({ event: 'node:remove', id }))
    this.flow.on('node:meta', ({ id }, key, value) => this.broadcast({ event: 'node:meta', id, key, value }))
    this.flow.on('node:data', ({ id }, data) => this.broadcast({ event: 'node:data', id, data }))
    this.flow.on('node:dataSchema', ({ id }, schema) => this.broadcast({ event: 'node:dataSchema', id, schema: serializeDataSchema(schema) }))
    this.flow.on('node:result', ({ id }, result) => this.broadcast({ event: 'node:result', id, result }))
    this.flow.on('node:resultSchema', ({ id }, schema) => this.broadcast({ event: 'node:resultSchema', id, schema: serializeResultSchema(schema) }))

    // --- Node lifecycle events.
    this.flow.on('node:start', ({ id }, data, meta) => this.broadcast({ event: 'node:start', id, data, ...meta }))
    this.flow.on('node:end', ({ id }, data, result, meta) => this.broadcast({ event: 'node:end', id, data, result, ...meta }))
    this.flow.on('node:abort', ({ id }, meta) => this.broadcast({ event: 'node:abort', id, ...meta }))
    this.flow.on('node:error', ({ id }, error, meta) => this.broadcast({ event: 'node:error', id, message: error.message, ...meta }))
  }

  /** The peers that are subscribed to the flow this. */
  participants: FlowSessionParticipant[] = []

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
      // const payloadSecrets = Object.values(this.flow.variables)
      const payloadJson = JSON.stringify(payload)
      // for (const secret of payloadSecrets)
      //   payloadJson = payloadJson.replaceAll(secret, '********')
      const payloadSafe = JSON.parse(payloadJson) as FlowSessionEventPayload<T>

      participant.peer.send(payloadSafe)
    }
  }

  async onMessage(peer: Peer, message: FlowSessionMessage) {

    // --- User events.
    switch (message.event) {
      case 'userLeave': {
        this.unsubscribe(peer)
        break
      }
      case 'userSetPosition': {
        const { x, y } = message
        this.broadcast({ event: 'user:position', id: peer.id, x, y }, peer)
        break
      }

      // --- Flow events.
      case 'flowSetMetaValue': {
        const { key, value } = message
        this.flow.setMeta(key, value)
        if (this.flow.meta.name) this.entity.title = this.flow.meta.name
        if (this.flow.meta.description) this.entity.description = this.flow.meta.description
        await this.save()
        break
      }
      case 'flowStart': {
        const { input } = message
        void this.flow.start(input)
        break
      }
      case 'flowAbort': {
        this.flow.abort()
        break
      }

      // --- Flow variable events.
      case 'flowVariableCreate': {
        const { user } = await userModule.authenticate(peer)
        const { workspace, project } = parameters
        const { name, value } = message
        const variable = await workspaceModule.createProjectVariable({ user, workspace, project, name, value })
        const { WorkspaceProjectVariable } = workspaceModule.getRepositories()
        await WorkspaceProjectVariable.save(variable)
        this.flow.context.variables.push(name)
        this.broadcast({ event: 'variables:create', name, value })
        break
      }
      case 'flowVariableUpdate': {
        const { user } = await userModule.authenticate(peer)
        const { workspace, project } = parameters
        const { name, value } = message
        await workspaceModule.updateProjectVariable({ user, workspace, project, name, value })
        this.broadcast({ event: 'variables:update', name, value })
        break
      }
      case 'flowVariableRemove': {
        const { user } = await userModule.authenticate(peer)
        const { workspace: workspace, project: project } = parameters
        const { name } = message
        await workspaceModule.removeProjectVariable({ user, workspace, project, name })
        delete this.flow.variables[name]
        this.broadcast({ event: 'variables:remove', name })
        break
      }

      // // --- Flow secret events.
      // case 'flowSecretCreate': {
      //   const { user } = await userModule.authenticate(peer)
      //   const { workspace, project } = parameters
      //   const { name, value } = message
      //   const secret = await workspaceModule.createProjectSecret({ user, workspace, project, name, value })
      //   const { WorkspaceProjectSecret } = workspaceModule.getRepositories()
      //   await WorkspaceProjectSecret.save(secret)
      //   this.flow.secrets[name] = value
      //   this.broadcast({ event: 'secrets:create', name, value })
      //   break
      // }
      // case 'flowSecretUpdate': {
      //   const { user } = await userModule.authenticate(peer)
      //   const { workspace, project } = parameters
      //   const { name, value } = message
      //   await workspaceModule.updateProjectSecret({ user, workspace, project, name, value })
      //   this.flow.secrets[name] = value
      //   this.broadcast({ event: 'secrets:update', name, value })
      //   break
      // }
      // case 'flowSecretRemove': {
      //   const { user } = await userModule.authenticate(peer)
      //   const { workspace, project } = parameters
      //   const { name } = message
      //   await workspaceModule.removeProjectSecret({ user, workspace, project, name })
      //   delete this.flow.secrets[name]
      //   this.broadcast({ event: 'secrets:remove', name })
      //   break
      // }

      // --- Node events.
      case 'nodeCreate': {
        const instance = this.flow.add(message.kind, {
          meta: { position: { x: message.x, y: message.y } },
          initialData: {},
          initialResult: {},
        })
        await instance.refresh()
        await this.save()
        break
      }
      case 'nodeDuplicate': {
        const instance = this.flow.get(message.nodeId)
        const duplicate = this.flow.add(instance.node, {
          meta: { position: { x: message.x, y: message.y } },
          initialData: instance.data,
        })
        await duplicate.refresh()
        await this.save()
        break
      }
      case 'nodeStart': {
        await this.flow.get(message.nodeId).start()
        break
      }
      case 'nodeAbort': {
        this.flow.get(message.nodeId).abort()
        break
      }
      case 'nodeSetDataValue': {
        const { nodeId, portId, value } = message
        const node = this.flow.get(nodeId)
        node.setDataValue(portId, value)
        await node.refresh()
        await this.save()
        break
      }
      case 'nodeSetMetaValue': {
        for (const { nodeId, key, value } of message.nodes)
          this.flow.get(nodeId).setMeta(key, value)
        await this.save()
        break
      }
      case 'nodesRemove': {
        const { nodeIds } = message
        this.flow.remove(...nodeIds)
        await this.save()
        break
      }

      // --- Link events.
      case 'linkCreate': {
        const { source, target } = message
        const [sourceNode, sourcePort] = source.split(':')
        const [targetNode, targetPort] = target.split(':')
        this.flow.link(sourceNode, sourcePort, targetNode, targetPort)
        await this.save()
        break
      }
      case 'linkRemove': {
        const { source } = message
        const [sourceNode, sourcePort] = source.split(':')
        this.flow.unlink(sourceNode, sourcePort)
        this.flow.unlink(undefined, undefined, sourceNode, sourcePort)
        await this.save()
        break
      }
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
export async function resolveFlowSession(this: ModuleFlow, flow: FlowEntity): Promise<FlowSessionInstance> {

  // --- Check if the chain session is already in memory.
  // --- If so, return the chain session from memory.
  const exists = this.flowSessions.get(flow.id)
  if (exists) return exists

  // --- Create the flow session and store it in memory.
  const flowInstance = await this.resolveFlowInstance(flow)
  const { Flow } = this.getRepositories()
  const session = new FlowSessionInstance(flowInstance, flow, Flow)
  this.flowSessions.set(flow.id, session)
  return session
}
