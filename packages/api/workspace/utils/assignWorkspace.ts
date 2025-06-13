import type { Loose } from '@unshared/types'
import type { WorkspaceAssignment } from '../entities'
import type { ModuleWorkspace } from '../index'
import { createParser } from '@unshared/validation'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from './assertWorkspace'
import { assertWorkspacePermission } from './assertWorkspacePermission'

/** The parsed options to assign the user to the workspace with. */
export const ASSIGN_USER_TO_WORKSPACE_OPTIONS = createParser({
  user: assertUser,
  workspace: assertWorkspace,
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
 * @returns An array of the newly created `WorkspaceAssignment` entities.
 * @example
 * // Get the workspace and user instances.
 * const workspace = await moduleWorkspace.getWorkspace({ name: 'my-workspace' })
 * const user = await moduleUser.getUser({ username: 'my-username' })
 *
 * // Assign the user to the workspace with the `Write` permission.
 * const assignments = await moduleWorkspace.assignWorkspace({ user, workspace, permission: 'Write' })
 * // [
 * //   WorkspaceAssignment { ..., Permission: 'Read' },
 * //   WorkspaceAssignment { ..., Permission: 'Write' },
 * // ]
 *
 * // Save the new assignments to the database.
 * await moduleWorkspace.getRepositories().WorkspaceAssignment.save(assignments)
 */
export async function assignWorkspace(this: ModuleWorkspace, options: AssignUserToWorkspaceOptions): Promise<WorkspaceAssignment[]> {
  const { user, workspace, permission } = ASSIGN_USER_TO_WORKSPACE_OPTIONS.call(undefined, options)
  const assignments: WorkspaceAssignment[] = []

  // --- Assert the user is not already assigned to the workspace.
  const { WorkspaceAssignment } = this.getRepositories()
  const exists = await WorkspaceAssignment.countBy({ user, workspace, permission })
  if (exists) throw this.errors.WORKSPACE_ALREADY_ASSIGNED(user.username, workspace.name, permission)

  // --- Also create the `Read` permission if the user does not have it.
  const hasRead = await WorkspaceAssignment.countBy({ user, workspace, permission: 'Read' })
  if (!hasRead && permission !== 'Read') {
    const read = WorkspaceAssignment.create({ user, workspace, permission: 'Read' })
    assignments.push(read)
  }

  // --- Create the assignment.
  const assignment = WorkspaceAssignment.create({ user, workspace, permission })
  assignments.push(assignment)
  return assignments
}
