import type { User } from '../../user'
import type { Workspace } from '../entities'

export interface WorkspaceUserAssignments {
  user: User
  permissions: string[]
}

/**
 * Get the assignments grouped by users. The function will return an array of objects
 * where each object contains the user and a list of permissions assigned to the user.
 *
 * @param workspace The workspace to get the assignments from.
 * @returns The assignments grouped by users.
 */
export function getWorkspaceUserAssignments(workspace: Workspace): undefined | WorkspaceUserAssignments[] {
  if (!workspace.assignments) throw new Error('The assignments are not loaded.')

  // --- Group the assignments by user.
  const result: WorkspaceUserAssignments[] = []
  for (const assignment of workspace.assignments) {
    if (!assignment.user) continue
    const user = assignment.user
    const permissions = assignment.permission
    const index = result.findIndex(item => item.user.username === user.username)
    if (index === -1) result.push({ user, permissions: [permissions] })
    else result[index].permissions.push(permissions)
  }

  // --- Return the assignments.
  return result
}
