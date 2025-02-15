import type { FindManyOptions, FindOptionsWhere } from 'typeorm'
import type { User } from '../../user'
import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { ILike, In } from 'typeorm'

/** The options to resolve the project with. */
export interface SearchProjectsOptions extends FindManyOptions<Project> {

  /**
   * The search query to find the project with. The search query will be used to search
   * for the project with the given name or title. The search query will be sanitized to
   * ensure that only alphanumeric characters are used.
   */
  search?: string

  /**
   * The name of the workspace to search for the project in. If the workspace is not provided,
   * the function will search for the project in the user's workspace.
   */
  workspace?: string

  /**
   * The `User` responsible for the request. The user will be used to determine if the
   * user has access to the project. If the user is not provided, the function will only
   * search for public projects.
   */
  user?: User
}

/**
 * Search for the `Project` with the given name. The function will query the database
 * for the project with the given name and assert that the user has access to the project.
 * If the project is not found or the user does not have access to the project, the function
 * will throw an error.
 *
 * @param options The options to find the project with.
 * @returns The `Project` with the given name.
 */
export async function searchProjects(this: ModuleProject, options: SearchProjectsOptions): Promise<Project[]> {
  const { search = '', user, workspace, ...findOptions } = options
  const { Project } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length < 3 ? ILike(`%${searchSafe}%`) : undefined

  // --- Search for all public projects within public workspaces.
  const where: Array<FindOptionsWhere<Project>> = [
    { name: searchOperator, workspace: { name: workspace, isPublic: true }, isPublic: true },
    { title: searchOperator, workspace: { name: workspace, isPublic: true }, isPublic: true },
  ]

  // --- If a user is provided, also search for projects the user has access to.
  if (user) {
    where.push(
      {
        name: searchOperator,
        assignments: { user, permission: In(['Owner', 'Read']) },
        workspace: [
          { name: workspace, isPublic: true },
          { name: workspace, assignments: { user, permission: In(['Owner', 'Read']) } },
        ],
      },
      {
        title: searchOperator,
        assignments: { user, permission: In(['Owner', 'Read']) },
        workspace: [
          { name: workspace, isPublic: true },
          { name: workspace, assignments: { user, permission: In(['Owner', 'Read']) } },
        ],
      },
    )
  }

  // --- If the project is not found, throw an error.
  return await Project.find({ ...findOptions, where })
}
