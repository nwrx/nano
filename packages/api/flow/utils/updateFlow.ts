import type { ModuleFlow } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertProject, ModuleProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertFlow } from './assertFlow'
import { getFlowEventBus } from './getFlowEventBus'

const UPDATE_FLOW_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
  user: assertUser,
  title: [[assert.undefined], [assert.string]],
  description: [[assert.undefined], [assert.string]],
})

export type UpdateFlowOptions = ReturnType<typeof UPDATE_FLOW_OPTIONS_SCHEMA>

/**
 * Update the flow with the given options.
 *
 * @param options The options to update the flow with.
 * @returns The updated flow entity.
 */
export async function updateFlow(this: ModuleFlow, options: UpdateFlowOptions): Promise<void> {
  const { user, flow, workspace, project, title, description } = UPDATE_FLOW_OPTIONS_SCHEMA(options)

  // --- Update the flow properties
  const { Flow } = this.getRepositories()
  if (title !== undefined) flow.title = title
  if (description !== undefined) flow.description = description
  flow.updatedBy = user
  await Flow.save(flow)

  // --- Notify listeners via the event bus.
  const eventData = Flow.create(flow).serialize({ withUpdatedBy: true })
  const eventBus = getFlowEventBus.call(this, { workspace, project, flow, createIfNotExists: true })
  await eventBus?.sendMessage({ event: 'flow.updated', data: eventData })

  // --- Notify the project event bus about the flow update.
  const moduleProject = this.getModule(ModuleProject)
  const projectEventBus = moduleProject.getEventBus({ workspace, project })
  await projectEventBus?.sendMessage({ event: 'project.flow.updated', data: eventData })
}
