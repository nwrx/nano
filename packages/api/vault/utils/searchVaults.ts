import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { ModuleVault } from '..'
import type { Vault } from '../entities'
import { assert, createSchema } from '@unshared/validation'
import { ILike, In } from 'typeorm'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

/** The parser function for the `searchVaults` function. */
export const SEARCH_VAULTS_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  workspace: assertWorkspace,
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<Vault>]],
})

/** The options to search for vaults. */
export type SearchVaultsOptions = Loose<ReturnType<typeof SEARCH_VAULTS_OPTIONS_SCHEMA>>

/**
 * Search for vaults within a workspace. The function will query the database
 * for vaults matching the search criteria and ensure proper access control.
 *
 * @param options The options to search vaults with.
 * @returns An array of vaults matching the search criteria.
 */
export async function searchVaults(this: ModuleVault, options: SearchVaultsOptions): Promise<Vault[]> {
  const { search = '', user, workspace, page = 1, limit = 10, order = { name: 'ASC' } } = SEARCH_VAULTS_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { Vault } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query and return the vaults
  return await Vault.find({
    where: {
      workspace,
      name: searchOperator,
      assignments: { user, permission: In(['Owner', 'Read']) },
    },
    order,
    take: limit,
    skip: (page - 1) * limit,
  })
}
