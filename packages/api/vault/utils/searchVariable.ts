import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { ModuleVault } from '..'
import type { VaultVariable } from '../entities'
import { assert, createSchema } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertVault } from './assertVault'

/** The parser function for the `searchVaultVariable` function. */
export const SEARCH_VAULT_VARIABLE_OPTIONS_SCHEMA = createSchema({
  vault: assertVault,
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<VaultVariable>]],
})

/** The options to search for vault variables. */
export type SearchVaultVariableOptions = Loose<ReturnType<typeof SEARCH_VAULT_VARIABLE_OPTIONS_SCHEMA>>

/**
 * Search for variables within a specific vault. The function will query the database
 * for variables matching the search criteria and ensure proper access control.
 *
 * @param options The options to search vault variables with.
 * @returns An array of vault variables matching the search criteria.
 */
export async function searchVaultVariable(this: ModuleVault, options: SearchVaultVariableOptions): Promise<VaultVariable[]> {
  const { search = '', vault, page = 1, limit = 10, order = { name: 'ASC' } } = SEARCH_VAULT_VARIABLE_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { VaultVariable } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query and return the vault variables
  return await VaultVariable.find({
    where: { vault, name: searchOperator },
    order,
    take: limit,
    skip: (page - 1) * limit,
  })
}
