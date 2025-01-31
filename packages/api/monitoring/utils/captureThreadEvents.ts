import type { Thread } from '@nwrx/nano'
import type { Flow } from '../../flow'
import type { MonitoringFlowThread } from '../entities'
import type { ModuleMonitoring } from '../index'
import { createResolvable } from '@unshared/functions'

/**
 * Collects all events from a flow thread. This will allow us to store the events
 * in the database and either replay them or use them for deep observability.
 *
 * @param thread The flow thread to collect the events from.
 * @param flow The flow entity to associate the events with.
 */
export function captureThreadEvents(this: ModuleMonitoring, thread: Thread, flow: Flow) {
  const { MonitoringFlowThread, MonitoringFlowThreadEvent /* , MonitoringFlowThreadNodeEvent */ } = this.getRepositories()
  const entityPromise = createResolvable<MonitoringFlowThread>()

  thread.on('start', async(input, meta) => {
    const entity = MonitoringFlowThread.create({ flow, events: [], nodeEvents: [] })
    const entitySaved = await MonitoringFlowThread.save(entity)
    entityPromise.resolve(entitySaved)
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'start',
      thread: entitySaved,
      data: input,
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('end', async(output, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'end',
      thread: await entityPromise,
      data: output,
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('error', async(error, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'error',
      thread: await entityPromise,
      data: { message: error.message, name: error.name },
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('input', async(key, value, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'input',
      thread: await entityPromise,
      data: { key, value },
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('output', async(key, value, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'output',
      thread: await entityPromise,
      data: { key, value },
      delta: meta.threadDelta,
      timestamp: meta.timestamp,
    }))
  })

  // thread.on('nodeStart', async({ node }, data, meta) => {
  //   await MonitoringFlowThreadNodeEvent.save(MonitoringFlowThreadNodeEvent.create({
  //     event: 'start',
  //     thread: await entityPromise,
  //     node: node.id,
  //     kind: node.kind,
  //     data: data.input,
  //     delta: meta.delta,
  //     duration: meta.duration,
  //     timestamp: meta.timestamp,
  //   }))
  // })

  // thread.on('nodeError', async({ node }, error, meta) => {
  //   await MonitoringFlowThreadNodeEvent.save(MonitoringFlowThreadNodeEvent.create({
  //     event: 'error',
  //     thread: await entityPromise,
  //     node: node.id,
  //     kind: node.kind,
  //     data: { message: error.message, name: error.name, stack: error.stack },
  //     delta: meta.delta,
  //     duration: meta.duration,
  //     timestamp: meta.timestamp,
  //   }))
  // })

  // thread.on('nodeEnd', async({ node }, data, meta) => {
  //   await MonitoringFlowThreadNodeEvent.save(MonitoringFlowThreadNodeEvent.create({
  //     event: 'end',
  //     thread: await entityPromise,
  //     node: node.id,
  //     kind: node.kind,
  //     data: data.output,
  //     delta: meta.delta,
  //     duration: meta.duration,
  //     timestamp: meta.timestamp,
  //   }))
  // })
}
