import type { FlowThread as FlowThreadInstance } from '@nwrx/core'
import type { Flow } from '../../flow'
import type { MonitoringFlowThread } from '../entities'
import type { ModuleMonitoring } from '../index'

/**
 * Collects all events from a flow thread. This will allow us to store the events
 * in the database and either replay them or use them for deep observability.
 *
 * @param thread The flow thread to collect the events from.
 * @param flow The flow entity to associate the events with.
 */
export function captureFlowThreadEvents(this: ModuleMonitoring, thread: FlowThreadInstance, flow: Flow) {
  const { MonitoringFlowThread, MonitoringFlowThreadEvent, MonitoringFlowThreadNodeEvent } = this.getRepositories()
  let entity: MonitoringFlowThread | undefined

  thread.on('start', async(input, meta) => {
    entity = await MonitoringFlowThread.save(MonitoringFlowThread.create({ flow, events: [], nodeEvents: [] }))
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'start',
      thread: entity,
      data: input,
      delta: meta.delta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('end', async(output, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'end',
      thread: entity,
      data: output,
      delta: meta.delta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('error', async(error, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'error',
      thread: entity,
      data: { message: error.message, name: error.name },
      delta: meta.delta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('input', async(key, value, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'input',
      thread: entity,
      data: { key, value },
      delta: meta.delta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('output', async(key, value, meta) => {
    await MonitoringFlowThreadEvent.save(MonitoringFlowThreadEvent.create({
      event: 'output',
      thread: entity,
      data: { key, value },
      delta: meta.delta,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('nodeStart', async({ node }, data, meta) => {
    await MonitoringFlowThreadNodeEvent.save(MonitoringFlowThreadNodeEvent.create({
      event: 'start',
      thread: entity,
      node: node.id,
      kind: node.kind,
      data: data.input,
      delta: meta.delta,
      duration: meta.duration,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('nodeError', async({ node }, error, meta) => {
    await MonitoringFlowThreadNodeEvent.save(MonitoringFlowThreadNodeEvent.create({
      event: 'error',
      thread: entity,
      node: node.id,
      kind: node.kind,
      data: { message: error.message, name: error.name, stack: error.stack },
      delta: meta.delta,
      duration: meta.duration,
      timestamp: meta.timestamp,
    }))
  })

  thread.on('nodeEnd', async({ node }, data, meta) => {
    await MonitoringFlowThreadNodeEvent.save(MonitoringFlowThreadNodeEvent.create({
      event: 'end',
      thread: entity,
      node: node.id,
      kind: node.kind,
      data: data.output,
      delta: meta.delta,
      duration: meta.duration,
      timestamp: meta.timestamp,
    }))
  })
}
