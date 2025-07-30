import type { Loose } from '@unshared/types'
import type { ProjectObject } from '../../project'
import type { RemoveEvent, RenameEvent } from '../../utils'
import type { WorkspaceObject } from '../entities'
import type { ModuleWorkspace } from '../index'
import type { WorkspaceUserPermissions } from './getWorkspaceAssignments'
import { createEventBus, type EventBus } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from './assertWorkspace'

export type WorkspaceEvent =
  | { event: 'workspace.archived'; data: RemoveEvent }
  | { event: 'workspace.assignment.created'; data: WorkspaceUserPermissions }
  | { event: 'workspace.assignment.removed'; data: RemoveEvent }
  | { event: 'workspace.project.created'; data: ProjectObject }
  | { event: 'workspace.project.removed'; data: RemoveEvent }
  | { event: 'workspace.project.renamed'; data: RenameEvent }
  | { event: 'workspace.project.updated'; data: ProjectObject }
  | { event: 'workspace.renamed'; data: RenameEvent }
  | { event: 'workspace.updated'; data: WorkspaceObject }

export const GET_PROJECT_EVENT_BUS_SCHEMA = createParser({
  workspace: assertWorkspace,
  createIfNotExists: [[assert.undefined], [assert.boolean]],
})

export type GetWorkspaceEventBusOptions = Loose<ReturnType<typeof GET_PROJECT_EVENT_BUS_SCHEMA>>

export function getWorkspaceEventBus(this: ModuleWorkspace, options: GetWorkspaceEventBusOptions): EventBus<WorkspaceEvent> | undefined {
  const { workspace, createIfNotExists } = GET_PROJECT_EVENT_BUS_SCHEMA(options)

  // --- Check if the event bus already exists.
  let eventBus = this.workspaceEventBus.get(workspace.id)
  if (eventBus) return eventBus
  if (!createIfNotExists) return

  // --- Create the event bus for the project.
  eventBus = createEventBus<WorkspaceEvent>({
    onUnmount: () => this.workspaceEventBus.delete(workspace.id),
  })

  // --- Add the event bus to the project event bus map.
  this.workspaceEventBus.set(workspace.id, eventBus)
  return eventBus
}
