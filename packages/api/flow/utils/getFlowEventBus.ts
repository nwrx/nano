import type { Loose } from '@unshared/types'
import type { RemoveEvent, RenameEvent } from '../../utils'
import type { FlowObject } from '../entities'
import type { ModuleFlow } from '../index'
import { createEventBus, type EventBus } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { assertProject } from '../../project'
import { assertWorkspace } from '../../workspace'
import { assertFlow } from './assertFlow'

export type FlowEvent =
  | { event: 'flow.removed'; data: RemoveEvent }
  | { event: 'flow.renamed'; data: RenameEvent }
  | { event: 'flow.updated'; data: FlowObject }

export const GET_PROJECT_EVENT_BUS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
  createIfNotExists: [[assert.undefined], [assert.boolean]],
})

export type GetFlowEventBusOptions = Loose<ReturnType<typeof GET_PROJECT_EVENT_BUS_SCHEMA>>

export function getFlowEventBus(this: ModuleFlow, options: GetFlowEventBusOptions): EventBus<FlowEvent> | undefined {
  const { flow, createIfNotExists } = GET_PROJECT_EVENT_BUS_SCHEMA(options)

  // --- Check if the event bus already exists.
  let eventBus = this.flowEventBuses.get(flow.id)
  if (eventBus) return eventBus
  if (!createIfNotExists) return

  // --- Create the event bus for the project.
  eventBus = createEventBus<FlowEvent>({
    onUnmount: () => this.flowEventBuses.delete(flow.id),
  })

  // --- Add the event bus to the project event bus map.
  this.flowEventBuses.set(flow.id, eventBus)
  return eventBus
}
