import type { FlowThread as FlowThreadInstance } from '@nwrx/core'
import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'

/**
 * Collects all events from a flow thread. This will allow us to store the events
 * in the database and either replay them or use them for deep observability.
 *
 * @param thread The flow thread to collect the events from.
 * @param flow The flow entity to associate the events with.
 */
export async function captureFlowThreadEvents(this: ModuleFlow, thread: FlowThreadInstance, flow: Flow) {
  const { FlowThread, FlowThreadEvent, FlowThreadNodeEvent } = this.getRepositories()
  const entity = await FlowThread.save(FlowThread.create({ flow, events: [], nodeEvents: [] }))

  thread.on('start', async(input, meta) => {
    await FlowThreadEvent.save(FlowThreadEvent.create({
      event: 'start',
      thread: entity,
      data: input,
      delta: meta.delta,
      timestamp: new Date(meta.timestamp),
    }))
  })

  thread.on('end', async(output, meta) => {
    await FlowThreadEvent.save(FlowThreadEvent.create({
      event: 'end',
      thread: entity,
      data: output,
      delta: meta.delta,
      timestamp: new Date(meta.timestamp),
    }))
  })

  thread.on('nodeStart', async({ node }, data, meta) => {
    await FlowThreadNodeEvent.save(FlowThreadNodeEvent.create({
      event: 'start',
      thread: entity,
      node: node.id,
      kind: node.kind,
      data: data.input,
      delta: meta.delta,
      duration: meta.duration,
      timestamp: new Date(meta.timestamp),
    }))
  })

  thread.on('nodeError', async({ node }, error, meta) => {
    await FlowThreadNodeEvent.save(FlowThreadNodeEvent.create({
      event: 'error',
      thread: entity,
      node: node.id,
      kind: node.kind,
      data: { message: error.message, stack: error.stack },
      delta: meta.delta,
      duration: meta.duration,
      timestamp: new Date(meta.timestamp),
    }))
  })

  thread.on('nodeEnd', async({ node }, data, meta) => {
    await FlowThreadNodeEvent.save(FlowThreadNodeEvent.create({
      event: 'end',
      thread: entity,
      node: node.id,
      kind: node.kind,
      data: data.output,
      delta: meta.delta,
      duration: meta.duration,
      timestamp: new Date(meta.timestamp),
    }))
  })
}
