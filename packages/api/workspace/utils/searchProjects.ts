import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { WorkspaceProject } from '../entities'
import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { ILike, In } from 'typeorm'

/** The parser fuction for the {@linkcode searchProjects} function. */
const SEARCH_PROJECTS_OPTIONS = createSchema({

  /** The `name` of the `WorkspaceProject` to find. */
  search: assertStringNotEmpty,

  /** The `User` responsible for the request. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],
})

/** The options to resolve the project with. */
export type SearchWorkspaceProjectsOptions = Loose<ReturnType<typeof SEARCH_PROJECTS_OPTIONS>>

/**
 * Search for the `WorkspaceProject` with the given name. The function will query the database
 * for the project with the given name and assert that the user has access to the project.
 * If the project is not found or the user does not have access to the project, the function
 * will throw an error.
 *
 * @param options The options to find the project with.
 * @returns The `WorkspaceProject` with the given name.
 */
export async function searchProjects(this: ModuleWorkspace, options: SearchWorkspaceProjectsOptions): Promise<WorkspaceProject[]> {
  const { search, user } = SEARCH_PROJECTS_OPTIONS(options)
  const { WorkspaceProject } = this.getRepositories()

  // --- Search for all public projects within public workspaces.
  const where: Array<FindOptionsWhere<WorkspaceProject>> = [
    { name: ILike(`%${search}%`), workspace: { isPublic: true }, isPublic: true },
    { title: ILike(`%${search}%`), workspace: { isPublic: true }, isPublic: true },
  ]

  // --- If a user is provided, also search for projects the user has access to.
  if (user) {
    where.push(
      {
        name: ILike(`%${search}%`),
        assignments: { user, permission: In(['Owner', 'Read']) },
        workspace: [
          { isPublic: true },
          { assignments: { user, permission: In(['Owner', 'Read']) } },
        ],
      },
      {
        title: ILike(`%${search}%`),
        assignments: { user, permission: In(['Owner', 'Read']) },
        workspace: [
          { isPublic: true },
          { assignments: { user, permission: In(['Owner', 'Read']) } },
        ],
      },
    )
  }

  // --- If the project is not found, throw an error.
  return await WorkspaceProject.find({ where, select: { id: true } })
}
