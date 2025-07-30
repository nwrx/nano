import type { ModuleFlow } from '../index'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertProject, ModuleProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertFlow } from './assertFlow'
import { getFlowEventBus } from './getFlowEventBus'

const RENAME_FLOW_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
  user: assertUser,
  name: [assert.stringNotEmpty, toSlug],
})

export type RenameFlowOptions = ReturnType<typeof RENAME_FLOW_OPTIONS_SCHEMA>

/**
 * Set the name of a flow. This function will check if the new name is available
 * in the project and update the flow's name.
 *
 * @param options The options to set the flow name with.
 * @returns The flow entity with updated name.
 */
export async function renameFlow(this: ModuleFlow, options: RenameFlowOptions): Promise<void> {
  const { workspace, project, flow, user, name } = RENAME_FLOW_OPTIONS_SCHEMA(options)

  // --- Check if the new name is already taken
  const { Flow } = this.getRepositories()
  const exists = await Flow.countBy({ name, project })
  if (exists > 0) throw this.errors.FLOW_NAME_TAKEN(workspace.name, project.name, name)

  // --- Update the flow name
  const oldName = flow.name
  flow.name = name
  flow.updatedBy = user
  await Flow.save(flow)

  // --- Notify listeners via the event bus.
  const eventData = { name, oldName, by: user.username }
  const eventBus = getFlowEventBus.call(this, { workspace, project, flow, createIfNotExists: true })
  await eventBus?.sendMessage({ event: 'flow.renamed', data: eventData })

  // --- Notify the project event bus about the flow rename.
  const moduleProject = this.getModule(ModuleProject)
  const projectEventBus = moduleProject.getEventBus({ workspace, project })
  await projectEventBus?.sendMessage({ event: 'project.flow.renamed', data: eventData })
}
