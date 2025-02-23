import type { Loose } from '@unshared/types'
import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace'
import { assertProjectPermission } from './assertProjectPermission'

/** The parser function for the {@linkcode getProject} function. */
const GET_PROJECT_OPTIONS_SCHEMA = createSchema({
  workspace: assertWorkspace,
  user: [[assert.undefined], [assertUser]],
  name: assert.stringNotEmpty,
  permission: assertProjectPermission,
})

/** The options to resolve the project with. */
export type GetProjectOptions = Loose<ReturnType<typeof GET_PROJECT_OPTIONS_SCHEMA>>

/**
 * Resolve the {@linkcode Project} with the given name. The function will query the database
 * for the project with the given name and assert that the user has access to the project.
 * If the project is not found or the user does not have access to the project, the function
 * will throw an error.
 *
 * @param options The options to find the project with.
 * @returns The {@linkcode Project} with the given name within the workspace.
 * @example await getProject({ name: 'my-project', workspace: 'my-workspace', permission: 'Read' }) // Project { ... }
 */
export async function getProject(this: ModuleProject, options: GetProjectOptions): Promise<Project> {
  const { name, workspace, user, permission } = GET_PROJECT_OPTIONS_SCHEMA(options)

  // --- Get the project.
  const { Project } = this.getRepositories()
  const project = await Project.findOne({
    where: user
      ? [{ name, workspace, isPublic: true }, { name, workspace, assignments: { user, permission: In(['Owner', 'Read']) } }]
      : [{ name, workspace, isPublic: true }],
  })

  // --- Return the project if it is public and no user is provided.
  if (!project) throw this.errors.PROJECT_NOT_FOUND(workspace.name, name)
  if (permission === 'Read') return project
  if (!user) throw this.errors.PROJECT_UNAUTHORIZED(workspace.name, name)

  // --- Assert that the user has an assignment that matches the permission.
  const { ProjectAssignment } = this.getRepositories()
  const isAllowed = await ProjectAssignment.countBy({ user, project, permission: In(['Owner', permission]) })
  if (!isAllowed) throw this.errors.PROJECT_UNAUTHORIZED(workspace.name, name)
  return project
}
