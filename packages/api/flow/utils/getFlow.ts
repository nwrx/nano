import type { Loose } from '@unshared/types'
import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertProject } from '../../project/utils/assertProject'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertFlowPermission } from './assertFlowPermission'

/** The parser fuction for the {@linkcode getFlow} function. */
const GET_FLOW_OPTIONS_SCHEMA = createSchema({
  user: [[assert.undefined], [assertUser]],
  name: assert.stringNotEmpty,
  workspace: assertWorkspace,
  project: assertProject,
  permission: assertFlowPermission,
})

/** The options to resolve the project with. */
export type GetFlowOptions = Loose<ReturnType<typeof GET_FLOW_OPTIONS_SCHEMA>>

/**
 * Resolves a flow by its name, project, and workspace.
 *
 * @param options The options to resolve the flow with.
 * @returns The resolved flow.
 */
export async function getFlow(this: ModuleFlow, options: GetFlowOptions): Promise<Flow> {
  const { user, workspace, project, name, permission } = GET_FLOW_OPTIONS_SCHEMA(options)

  // --- Get the flow.
  const { Flow } = this.getRepositories()
  const flow = await Flow.findOne({
    where: user
      ? [{ name, project, isPublic: true }, { name, project, assignments: { user, permission: In(['Owner', 'Read']) } }]
      : [{ name, project, isPublic: true }],
  })

  // --- Return the project if it is public and no user is provided.
  if (!flow) throw this.errors.FLOW_NOT_FOUND(workspace.name, project.name, name)
  if (permission === 'Read') return flow
  if (!user) throw this.errors.FLOW_UNAUTHORIZED(workspace.name, project.name, name)

  // --- Assert that the user has an assignment that matches the permission.
  const { FlowAssignment } = this.getRepositories()
  const isAllowed = await FlowAssignment.countBy({ user, flow: { id: flow.id }, permission: In(['Owner', permission]) })
  if (!isAllowed) throw this.errors.FLOW_FORBIDDEN(workspace.name, project.name, name)
  return flow
}
