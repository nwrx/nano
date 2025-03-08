import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { ModuleVault } from '..'
import type { VaultVariable } from '../entities'
import { assert, createSchema } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertProject } from '../../project'

/** The parser function for the `searchVariableByProject` function. */
export const SEARCH_VARIABLE_BY_PROJECT_OPTIONS_SCHEMA = createSchema({
  project: assertProject,
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<VaultVariable>]],
  withVault: [[assert.undefined], [assert.boolean]],
})

/** The options to search for project variables. */
export type SearchVariableByProjectOptions = Loose<ReturnType<typeof SEARCH_VARIABLE_BY_PROJECT_OPTIONS_SCHEMA>>

/**
 * Search for variables within all vaults assigned to a specific project.
 * The function will query the database for variables matching the search criteria
 * and ensure proper access control based on project assignments.
 *
 * @param options The options to search project variables with.
 * @returns An array of vault variables matching the search criteria.
 */
export async function searchVariableByProject(this: ModuleVault, options: SearchVariableByProjectOptions): Promise<VaultVariable[]> {
  const {
    search = '',
    project,
    page = 1,
    limit = 10,
    order = { name: 'ASC' },
    withVault,
  } = SEARCH_VARIABLE_BY_PROJECT_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { VaultVariable } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query and return the vault variables
  return await VaultVariable.find({
    where: { vault: { projects: { project, permission: 'Use' } }, name: searchOperator },
    relations: { vault: withVault },
    order,
    take: limit,
    skip: (page - 1) * limit,
  })
}
