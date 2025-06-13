import type { Loose } from '@unshared/types'
import type { ModuleProject } from '../index'
import type { ProjectPermission } from './assertProjectPermission'
import { createParser } from '@unshared/validation'
import { assertProject } from './assertProject'

/** A map of the project assignments by user. */
export interface ProjectUserPermissions {
  username: string
  displayName: string
  permissions: ProjectPermission[]
}

/** The parser function for the {@linkcode getProject} function. */
const GET_PROJECT_ASSIGNMENTS_OPTIONS_SCHEMA = createParser({
  project: assertProject,
})

/** The options to resolve the project with. */
export type GetProjectAssignmentsOptions = Loose<ReturnType<typeof GET_PROJECT_ASSIGNMENTS_OPTIONS_SCHEMA>>

/**
 * Resolve the {@linkcode ProjectUserPermissions} for the given project. The function will query the database
 * for every assignment within the project and return the assignments by user.
 *
 * @param options The options to find the project assignments with.
 * @returns The {@linkcode ProjectUserPermissions} within the project.
 * @example await getProjectAssignments({ project }) // { 'user-1': { displayName: 'User 1', permissions: ['Owner'] }, ... }
 */
export async function getProjectAssignments(this: ModuleProject, options: GetProjectAssignmentsOptions): Promise<ProjectUserPermissions[]> {
  const { project } = GET_PROJECT_ASSIGNMENTS_OPTIONS_SCHEMA(options)

  // --- Get the project assignments from the database.
  const { ProjectAssignment } = this.getRepositories()
  const assignments = await ProjectAssignment.find({ where: { project }, relations: { user: { profile: true } } })

  // --- Collect the assignments by user.
  const assignmentsByUser: Record<string, ProjectUserPermissions> = {}
  for (const { user, permission } of assignments) {
    const { username, profile } = user!
    const { displayName } = profile!
    if (!assignmentsByUser[username]) assignmentsByUser[username] = { username, displayName, permissions: [] }
    assignmentsByUser[username].permissions.push(permission)
  }

  // --- Return the assignments by user.
  return Object.values(assignmentsByUser)
}
