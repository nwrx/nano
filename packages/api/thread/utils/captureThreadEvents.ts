import type { Thread } from '@nwrx/nano'
import type { Flow } from '../../flow'
import { createResolvable } from '@unshared/functions'
import { ProjectObject } from '../../project'
import { ThreadEventObject, ThreadObject } from '../entities'

export interface MonitoringSessionState {
  projects: ProjectObject[]
  threads: ThreadObject[]
  events: ThreadEventObject[]
  nodeEvents: ThreadEventObject[]
}

export interface MonitoringSessionEventMap {
  init: MonitoringSessionState
  'threads:update': { threads: ThreadObject[] }
  'threads:push': { thread: ThreadObject }
  'events:update': { events: ThreadEventObject[]; nodeEvents: ThreadEventObject[] }
  'events:push': { events: ThreadEventObject[]; nodeEvents: ThreadEventObject[] }
  'event:update': { event: ThreadEventObject }
  error: { message: string; name: string }
}

export type MonitoringSessionEventName = keyof MonitoringSessionEventMap
export type MonitoringSessionEventPayload<K extends MonitoringSessionEventName = MonitoringSessionEventName> =
  { [P in K]: MonitoringSessionEventMap[P] & { event: P } }[K]

/**
 * Collects all events from a flow thread. This will allow us to store the events
 * in the database and either replay them or use them for deep observability.
 *
 * @param thread The flow thread to collect the events from.
 * @param flow The flow entity to associate the events with.
 */
export function captureThreadEvents(this: ModuleMonitoring, thread: Thread, flow: Flow) {
  const { Thread, ThreadEvent, ThreadNodeEvent } = this.getRepositories()
  const entityPromise = createResolvable<Thread>()

  thread.on('start', async(input, meta) => {
    const entity = Thread.create({ flow, events: [], nodeEvents: [] })
    const entitySaved = await Thread.save(entity)
    entityPromise.resolve(entitySaved)
    await ThreadEvent.save(ThreadEvent.create({
      event: 'start',
      thread: entitySaved,
      data: input,
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('end', async(output, meta) => {
    await ThreadEvent.save(ThreadEvent.create({
      event: 'end',
      thread: await entityPromise,
      data: output,
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('error', async(error, meta) => {
    await ThreadEvent.save(ThreadEvent.create({
      event: 'error',
      thread: await entityPromise,
      data: { message: error.message, name: error.name },
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('input', async(key, value, meta) => {
    await ThreadEvent.save(ThreadEvent.create({
      event: 'input',
      thread: await entityPromise,
      data: { key, value },
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('output', async(key, value, meta) => {
    await ThreadEvent.save(ThreadEvent.create({
      event: 'output',
      thread: await entityPromise,
      data: { key, value },
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('nodeStart', async(id, data, meta) => {
    await ThreadNodeEvent.save(ThreadNodeEvent.create({
      event: 'start',
      thread: await entityPromise,
      node: id,
      kind: 'node.kind',
      data: data.data,
      delta: meta.threadDelta,
      duration: meta.nodeDuration,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('nodeError', async(id, error, meta) => {
    await ThreadNodeEvent.save(ThreadNodeEvent.create({
      event: 'error',
      thread: await entityPromise,
      node: id,
      kind: 'node.kind',
      data: { message: error.message, name: error.name, stack: error.stack },
      delta: meta.threadDelta,
      duration: meta.nodeDuration,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('nodeEnd', async(id, data, meta) => {
    await ThreadNodeEvent.save(ThreadNodeEvent.create({
      event: 'end',
      thread: await entityPromise,
      node: id,
      kind: 'node.kind',
      data: data.data,
      delta: meta.threadDelta,
      duration: meta.nodeDuration,
      timestamp: meta.timestamp,
    }))
  })
}
