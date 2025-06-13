import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { RegistryCategory } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertRegistryCategoryType } from './assertRegistryCategoryType'

/** The parser function for the `searchRegistryCategory` function. */
export const SEARCH_REGISTRY_CATEGORY_OPTIONS_SCHEMA = createParser({
  search: [[assert.undefined], [assert.string]],
  type: [[assert.undefined], [assertRegistryCategoryType]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<RegistryCategory>]],
})

/** The options to search for registry categories. */
export type SearchRegistryCategoryOptions = Loose<ReturnType<typeof SEARCH_REGISTRY_CATEGORY_OPTIONS_SCHEMA>>

/**
 * Search for registry categories in a workspace.
 *
 * @param options The search options including search term and pagination.
 * @returns An array of matching registry categories.
 */
export async function searchRegistryCategory(this: ModuleRegistry, options: SearchRegistryCategoryOptions): Promise<RegistryCategory[]> {
  const { search = '', type, page = 1, limit = 10, order = { name: 'ASC' } } = SEARCH_REGISTRY_CATEGORY_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { RegistryCategory } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Return the found categories
  return await RegistryCategory.find({
    where: [
      { name: searchOperator, type },
      { title: searchOperator, type },
    ],
    order,
    take: limit,
    skip: (page - 1) * limit,
    relations: {
      components: { collection: { workspace: true } },
    },
  })
}
