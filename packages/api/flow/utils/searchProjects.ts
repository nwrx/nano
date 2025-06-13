import type { Loose } from '@unshared/types'
import type { FindOptionsOrder, FindOptionsWhere } from 'typeorm'
import type { Flow } from '../entities'
import type { ModuleFlow } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike, In } from 'typeorm'
import { assertProject } from '../../project'
import { assertUser } from '../../user'

/** The parser function for the `searchProjects` function. */
export const SEARCH_FLOW_OPTIONS_SCHEMA = createParser({
  project: assertProject,
  search: [[assert.undefined], [assert.string]],
  user: [[assert.undefined], [assertUser]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<Flow>]],
})

/** The options to search for projects. */
export type SearchProjectsOptions = Loose<ReturnType<typeof SEARCH_FLOW_OPTIONS_SCHEMA>>

/**
 * Search for the `Flow` with the given name. The function will query the database
 * for the project with the given name and assert that the user has access to the project.
 * If the project is not found or the user does not have access to the project, the function
 * will throw an error.
 *
 * @param options The options to find the project with.
 * @returns The `Flow` with the given name.
 */
export async function searchFlow(this: ModuleFlow, options: SearchProjectsOptions): Promise<Flow[]> {
  const { search = '', user, project, page = 1, limit = 10, order = { name: 'ASC' } } = SEARCH_FLOW_OPTIONS_SCHEMA(options)

  // --- Sanitize the search string.
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Search for all public projects within public workspaces.
  const where: Array<FindOptionsWhere<Flow>> = [
    { name: searchOperator, project, isPublic: true },
    { title: searchOperator, project, isPublic: true },
  ]

  // --- If a user is provided, also search for projects the user has access to.
  if (user) {
    where.push(
      { name: searchOperator, project, assignments: { user, permission: In(['Owner', 'Read']) } },
      { title: searchOperator, project, assignments: { user, permission: In(['Owner', 'Read']) } },
    )
  }

  // --- If the project is not found, throw an error.
  const { Flow } = this.getRepositories()
  return await Flow.find({
    where,
    order,
    take: limit,
    skip: (page - 1) * limit,
  })
}
