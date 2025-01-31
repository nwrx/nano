import type { Loose } from '@unshared/types'
import type { WorkspaceAssignment } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { assertWorkspacePermission } from './assertWorkspacePermission'

/** The parsed options to assign the user to the workspace with. */
const ASSIGN_USER_TO_WORKSPACE_OPTIONS = createSchema({

  /** The `User` instance of the user responsible for the request. */
  user: createSchema({
    id: assertStringUuid,
    username: assertStringNotEmpty,
  }),

  /** The `name` of the `Workspace` to assign the user to. */
  workspace: createSchema({
    id: assertStringUuid,
    name: assertStringNotEmpty,
  }),

  /** The permission to assign to the user. */
  permission: assertWorkspacePermission,
})

/** The options to assign the user to the workspace with. */
export type AssignUserToWorkspaceOptions = Loose<ReturnType<typeof ASSIGN_USER_TO_WORKSPACE_OPTIONS>>

/**
 * Assign a user to a workspace with the given permission. The function will create a new
 * assignment for the user and workspace with the given permission. The function will throw
 * an error if the user is already assigned to the workspace with the same permission.
 *
 * @param options The options to assign the user to the workspace with.
 * @returns The newly created `WorkspaceAssignment` entity.
 */
export async function assignWorkspace(this: ModuleWorkspace, options: AssignUserToWorkspaceOptions): Promise<WorkspaceAssignment> {
  const { user, workspace, permission } = ASSIGN_USER_TO_WORKSPACE_OPTIONS(options)

  // --- Assert the user is not already assigned to the workspace.
  const { WorkspaceAssignment } = this.getRepositories()
  const existing = await WorkspaceAssignment.findOneBy({ user, workspace, permission })
  if (existing) throw this.errors.WORKSPACE_ALREADY_ASSIGNED(user.username, workspace.name, permission)

  // --- Also create the `Read` permission if the user does not have it.
  const hasRead = await WorkspaceAssignment.findOneBy({ user, workspace, permission: 'Read' })
  if (!hasRead && permission !== 'Read') {
    const read = WorkspaceAssignment.create({ user, workspace, permission: 'Read' })
    await WorkspaceAssignment.save(read)
  }

  // --- Create the assignment.
  const assignment = WorkspaceAssignment.create({ user, workspace, permission })
  return await WorkspaceAssignment.save(assignment)
}
