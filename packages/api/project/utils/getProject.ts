import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertProjectPermission } from './assertProjectPermission'

/** The parser function for the {@linkcode getProject} function. */
const GET_PROJECT_OPTIONS_SCHEMA = createSchema({

  /** The `name` of the {@linkcode Project} to find. */
  name: assertStringNotEmpty,

  /** The name of the `Workspace` where the project is located. */
  workspace: assertStringNotEmpty,

  /** The `User` responsible for the request. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** At least one permission required to access the project. */
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
  const { Project } = this.getRepositories()
  const where: Array<FindOptionsWhere<Project>> = []

  // --- Abort early if the user is not authenticated and the permission is not 'Read'.
  if (!user && permission !== 'Read')
    throw this.errors.PROJECT_UNAUTHORIZED(workspace, name)

  // --- If the user is the owner of the workspace, bypass all checks.
  where.push({
    name,
    workspace: {
      name: workspace,
      assignments: { user, permission: 'Owner' },
    },
  })

  // --- If the request permission is 'Read', allow public projects within
  // --- user-accessible workspaces to be retrieved. In our context, any
  // --- permission on a workspace and project implicitly grants 'Read' access.
  if (permission === 'Read') {
    where.push({
      name,
      isPublic: true,
      workspace: { name: workspace, isPublic: true },
    })
    if (user) {
      where.push({
        name,
        assignments: { user },
        workspace: { name: workspace, assignments: { user } },
      })
    }
  }

  // --- For any other permission, the user must have implicit 'Read' access
  // --- to the workspace and a matching permission to the project itself.
  else {
    where.push({
      name,
      workspace: { name: workspace, assignments: { user } },
      assignments: { user, permission: In(['Owner', permission]) },
    })
  }

  // --- Now that we have the where clause, we can query the database for the project.
  const result = await Project.findOne({ where, select: { id: true, name: true } })
  if (result) return result

  // --- If the project was not found, it means that there wasn't any project
  // --- that matched the assignments and private/public criterias. We don't
  // --- know if it was because the project didn't exist or if the user was not
  // --- authorized to access it and we don't want to know it.
  throw permission === 'Read'
    ? this.errors.PROJECT_NOT_FOUND(workspace, name)
    : this.errors.PROJECT_UNAUTHORIZED(workspace, name)
}
