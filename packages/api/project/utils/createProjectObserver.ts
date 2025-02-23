import type { Peer } from 'crossws'
import type { FlowObject } from '../../flow'
import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const PROJECT_OBSERVER_MESSAGE_SCHEMA = createRuleSet(
  [createSchema({
    event: assert.stringEquals('flows'),
    flows: createArrayParser(assert.object as (value: unknown) => asserts value is FlowObject),
  })],

  [createSchema({
    event: assert.stringEquals('flowCreated'),
    flow: assert.object as (value: unknown) => asserts value is FlowObject,
  })],

  [createSchema({
    event: assert.stringEquals('flowUpdated'),
    flow: assert.object as (value: unknown) => asserts value is FlowObject,
  })],

  [createSchema({
    event: assert.stringEquals('flowRenamed'),
    oldName: assert.stringNotEmpty,
    newName: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('flowDeleted'),
    name: assert.stringNotEmpty,
  })],
)

/** The message sent from the server to the client in a project. */
export type ProjectObserverMessage = ReturnType<typeof PROJECT_OBSERVER_MESSAGE_SCHEMA>

/**
 * A wrapper class that is used to inform the changes occurring in a project.
 * This enables us to have a dynamic interface where we can see the flows created
 * and updated by other users in real-time as well as their associated threads.
 */
export class ProjectObserver {
  peers = new Set<Peer>()

  subscribe(peer: Peer) {
    const isSubscribed = this.peers.has(peer)
    if (isSubscribed) return
    this.peers.add(peer)
  }

  unsubscribe(peer: Peer) {
    this.peers.delete(peer)
  }

  send(peer: Peer, message: ProjectObserverMessage) {
    peer.send(message)
  }

  broadcast(message: ProjectObserverMessage) {
    for (const peer of this.peers) peer.send(message)
  }
}
