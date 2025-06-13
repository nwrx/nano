import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { RegistryCollection } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike, In } from 'typeorm'
import { assertWorkspace } from '../../workspace'
import { assertRegistryCategory } from './assertRegistryCategory'

/** The parser function for the `searchRegistryCollection` function. */
export const SEARCH_REGISTRY_COLLECTION_OPTIONS_SCHEMA = createParser({
  workspace: [[assert.undefined], [assertWorkspace]],
  categories: [[assert.undefined], [assert.arrayOf(assertRegistryCategory)]],
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<RegistryCollection>]],
  withComponents: [[assert.undefined], [assert.boolean]],
  withCategories: [[assert.undefined], [assert.boolean]],
  withWorkspace: [[assert.undefined], [assert.boolean]],
})

/** The options to search for registry collections. */
export type SearchRegistryCollectionOptions = Loose<ReturnType<typeof SEARCH_REGISTRY_COLLECTION_OPTIONS_SCHEMA>>

/**
 * Search for registry collections in a workspace.
 *
 * @param options The search options including workspace, search term, and pagination.
 * @returns An array of matching registry collections.
 */
export async function searchRegistryCollection(this: ModuleRegistry, options: SearchRegistryCollectionOptions): Promise<RegistryCollection[]> {
  const {
    search = '',
    workspace,
    categories,
    page = 1,
    limit = 10,
    order = { name: 'ASC' },
    withComponents = false,
    withCategories = false,
    withWorkspace = false,
  } = SEARCH_REGISTRY_COLLECTION_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { RegistryCollection } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length < 3 ? ILike(`%${searchSafe}%`) : undefined

  // --- Return the found collections
  return await RegistryCollection.find({
    where: [
      { name: searchOperator, workspace, components: categories ? { categories: { name: In(categories.map(category => category.name)) } } : false },
      { title: searchOperator, workspace, components: categories ? { categories: { name: In(categories.map(category => category.name)) } } : false },
    ],
    order,
    take: limit,
    skip: (page - 1) * limit,
    relations: {
      workspace: withWorkspace,
      components: (withComponents || withCategories)
        ? { categories: withCategories }
        : false,
    },
  })
}
