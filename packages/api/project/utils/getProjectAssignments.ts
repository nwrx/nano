import type { User } from '../../user'
import type { Project } from '../entities'
import type { ProjectPermission } from './assertProjectPermission'

export interface ProjectUserPermissions {
  user: User
  permissions: ProjectPermission[]
}

/**
 * Get the assignments grouped by users. The function will return an array of objects
 * where each object contains the user and a list of permissions assigned to the user.
 *
 * @param project The project to get the assignments from.
 * @returns The assignments grouped by users.
 */
export function getProjectAssignments(project: Project): ProjectUserPermissions[] {
  if (!project.assignments) throw new Error('Assignments relation is not loaded.')

  // --- Group the assignments by user.
  const result: ProjectUserPermissions[] = []
  for (const assignment of project.assignments) {
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
