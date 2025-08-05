import type { Loose } from '@unshared/types'
import type { RemoveEvent, RenameEvent } from '../../utils'
import type { RunnerObject } from '../entities'
import type { ModuleRunner } from '../index'
import { createEventBus, type EventBus } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { assertRunner } from './assertRunner'

export type RunnerEvent =
  | { event: 'runner.removed'; data: RemoveEvent }
  | { event: 'runner.renamed'; data: RenameEvent }
  | { event: 'runner.updated'; data: RunnerObject }

export const GET_RUNNER_EVENTS_SCHEMA = createParser({
  runner: assertRunner,
  createIfNotExists: [[assert.undefined], [assert.boolean]],
})

export type GetRunnerEventBusOptions = Loose<ReturnType<typeof GET_RUNNER_EVENTS_SCHEMA>>

export function getRunnerEvents(this: ModuleRunner, options: GetRunnerEventBusOptions): EventBus<RunnerEvent> | undefined {
  const { runner, createIfNotExists } = GET_RUNNER_EVENTS_SCHEMA(options)

  // --- Check if the event bus already exists.
  let events = this.eventsByRunner.get(runner.id)
  if (events) return events
  if (!createIfNotExists) return

  // --- Create the event bus for the runner.
  events = createEventBus<RunnerEvent>({
    onUnmount: () => this.eventsByRunner.delete(runner.id),
  })

  // --- Add the event bus to the runner event bus map.
  this.eventsByRunner.set(runner.id, events)
  return events
}
