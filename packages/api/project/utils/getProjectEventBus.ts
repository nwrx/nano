import type { Loose } from '@unshared/types'
import type { FlowObject } from '../../flow'
import type { RemoveEvent, RenameEvent } from '../../utils'
import type { ProjectObject } from '../entities'
import type { ModuleProject } from '../index'
import { createEventBus, type EventBus } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from '../../workspace'
import { assertProject } from './assertProject'

export type ProjectEvent =
  | { event: 'project.flow.created'; data: FlowObject }
  | { event: 'project.flow.removed'; data: RemoveEvent }
  | { event: 'project.flow.renamed'; data: RenameEvent }
  | { event: 'project.flow.updated'; data: FlowObject }
  | { event: 'project.removed'; data: RemoveEvent }
  | { event: 'project.renamed'; data: RenameEvent }
  | { event: 'project.updated'; data: ProjectObject }

export const GET_PROJECT_EVENT_BUS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  createIfNotExists: [[assert.undefined], [assert.boolean]],
})

export type GetProjectEventBusOptions = Loose<ReturnType<typeof GET_PROJECT_EVENT_BUS_SCHEMA>>

export function getProjectEventBus(this: ModuleProject, options: GetProjectEventBusOptions): EventBus<ProjectEvent> | undefined {
  const { project, createIfNotExists } = GET_PROJECT_EVENT_BUS_SCHEMA(options)

  // --- Check if the event bus already exists.
  let eventBus = this.projectsEventBus.get(project.id)
  if (eventBus) return eventBus
  if (!createIfNotExists) return

  // --- Create the event bus for the project.
  eventBus = createEventBus<ProjectEvent>({
    onUnmount: () => this.projectsEventBus.delete(project.id),
  })

  // --- Add the event bus to the project event bus map.
  this.projectsEventBus.set(project.id, eventBus)
  return eventBus
}
