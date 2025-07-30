import type { ModuleFlow } from '../index'
import { createParser } from '@unshared/validation'
import { assertProject, ModuleProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertFlow } from './assertFlow'
import { getFlowEventBus } from './getFlowEventBus'

const REMOVE_FLOW_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
  user: assertUser,
})

export type RemoveFlowOptions = ReturnType<typeof REMOVE_FLOW_OPTIONS_SCHEMA>

/**
 * Remove a flow from the project. This function will soft-delete the flow
 * from the database and notify any listeners via the flow event bus.
 *
 * @param options The options to remove the flow with.
 * @returns The removed flow entity.
 */
export async function removeFlow(this: ModuleFlow, options: RemoveFlowOptions): Promise<void> {
  const { workspace, project, flow, user } = REMOVE_FLOW_OPTIONS_SCHEMA(options)

  // --- Soft remove the flow from the database
  const { Flow } = this.getRepositories()
  flow.deletedBy = user
  flow.deletedAt = new Date()
  await Flow.save(flow)

  // --- Notify listeners via the event bus and close it.
  const eventData = { name: flow.name, by: user.username }
  const eventBus = getFlowEventBus.call(this, { workspace, project, flow })
  await eventBus?.sendMessage({ event: 'flow.removed', data: eventData })
  await eventBus?.close()

  // --- Notify the project event bus about the flow removal.
  const moduleProject = this.getModule(ModuleProject)
  const projectEventBus = moduleProject.getEventBus({ workspace, project })
  await projectEventBus?.sendMessage({ event: 'project.flow.removed', data: eventData })
}
