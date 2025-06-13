import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '../index'
import type { WorkspacePermission } from './assertWorkspacePermission'
import { createParser } from '@unshared/validation'
import { assertWorkspace } from './assertWorkspace'

/** A map of the workspace assignments by user. */
export interface WorkspaceUserPermissions {
  username: string
  displayName: string
  permissions: WorkspacePermission[]
}

/** The parser function for the {@linkcode getWorkspace} function. */
const GET_WORKSPACE_ASSIGNMENTS_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
})

/** The options to resolve the workspace with. */
export type GetWorkspaceAssignmentsOptions = Loose<ReturnType<typeof GET_WORKSPACE_ASSIGNMENTS_OPTIONS_SCHEMA>>

/**
 * Resolve the {@linkcode WorkspaceUserPermissions} for the given workspace. The function will query the database
 * for every assignment within the workspace and return the assignments by user.
 *
 * @param options The options to find the workspace assignments with.
 * @returns The {@linkcode WorkspaceUserPermissions} within the workspace.
 * @example await getWorkspaceAssignments({ workspace }) // { 'user-1': { displayName: 'User 1', permissions: ['Owner'] }, ... }
 */
export async function getWorkspaceAssignments(this: ModuleWorkspace, options: GetWorkspaceAssignmentsOptions): Promise<WorkspaceUserPermissions[]> {
  const { workspace } = GET_WORKSPACE_ASSIGNMENTS_OPTIONS_SCHEMA(options)

  // --- Get the workspace assignments from the database.
  const { WorkspaceAssignment } = this.getRepositories()
  const assignments = await WorkspaceAssignment.find({ where: { workspace }, relations: { user: { profile: true } } })

  // --- Collect the assignments by user.
  const assignmentsByUser: Record<string, WorkspaceUserPermissions> = {}
  for (const { user, permission } of assignments) {
    const { username, profile } = user!
    const { displayName } = profile!
    if (!assignmentsByUser[username]) assignmentsByUser[username] = { username, displayName, permissions: [] }
    assignmentsByUser[username].permissions.push(permission)
  }

  // --- Return the assignments by user.
  return Object.values(assignmentsByUser)
}
