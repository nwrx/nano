import type { Loose } from '@unshared/types'
import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { toSlug } from '@unshared/string/toSlug'
import { assert, createParser } from '@unshared/validation'
import { assertProject, ModuleProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { getRandomName } from './getRandomName'

const CREATE_FLOW_OPTIONS = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  user: assertUser,
  name: [[assert.undefined, getRandomName], [assert.stringNotEmpty, toSlug]],
  isPublic: [[assert.undefined], [assert.boolean]],
})

/** The options to create the flow with. */
export type CreateFlowOptions = Loose<ReturnType<typeof CREATE_FLOW_OPTIONS>>

/**
 * Create a new flow in the project with the given name and title. The function
 * will create a new flow with the given name and title and assign the user to
 * the flow with full access. The function will throw an error if the flow
 * already exists in the project.
 *
 * @param options The options to create the flow with.
 * @returns The newly created `Flow` entity.
 */
export async function createFlow(this: ModuleFlow, options: CreateFlowOptions): Promise<Flow> {
  const { Flow, FlowAssignment } = this.getRepositories()
  const { workspace, project, user, name, isPublic } = CREATE_FLOW_OPTIONS(options)

  // --- Check if the flow already exists in the project.
  const exists = await Flow.countBy({ name, project })
  if (exists > 0) throw this.errors.FLOW_NAME_TAKEN(workspace.name, project.name, name)

  // --- Create and save the flow and assign the user as the owner.
  const assignment = FlowAssignment.create({ user, permission: 'Owner' })
  const flow = Flow.create({ name, project, isPublic, createdBy: user, assignments: [assignment] })
  await Flow.save(flow)

  // --- Notify the project event bus about the new flow.
  const moduleProject = this.getModule(ModuleProject)
  const eventData = flow.serialize({ withCreatedBy: true })
  const eventBus = moduleProject.getEventBus({ workspace, project })
  await eventBus?.sendMessage({ event: 'project.flow.created', data: eventData })

  // --- Return the newly created flow.
  return flow
}
