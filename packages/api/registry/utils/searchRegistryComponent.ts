import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { RegistryComponent } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertWorkspace } from '../../workspace'
import { assertRegistryCategory } from './assertRegistryCategory'
import { assertRegistryCollection } from './assertRegistryCollection'

/** The parser function for the `searchRegistryComponent` function. */
export const SEARCH_REGISTRY_COMPONENT_OPTIONS_SCHEMA = createSchema({
  workspace: [[assert.undefined], [assertWorkspace]],
  collection: [[assert.undefined], [assertRegistryCollection]],
  categories: [[assert.undefined], [assertRegistryCategory]],
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<RegistryComponent>]],
})

/** The options to search for registry components. */
export type SearchRegistryComponentOptions = Loose<ReturnType<typeof SEARCH_REGISTRY_COMPONENT_OPTIONS_SCHEMA>>

/**
 * Search for registry components in a workspace. If a user is provided, it will include
 * components the user has access to. The search can be filtered by name and supports
 * pagination.
 *
 * @param options The search options including workspace, search term, and pagination.
 * @returns An array of matching registry components.
 */
export async function searchRegistryComponent(this: ModuleRegistry, options: SearchRegistryComponentOptions): Promise<RegistryComponent[]> {
  const { search = '', collection, categories, page = 1, limit = 10, order = { name: 'ASC' } } = SEARCH_REGISTRY_COMPONENT_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { RegistryComponent } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Return the found components
  return await RegistryComponent.find({
    where: [
      { name: searchOperator, collection, categories },
      { title: searchOperator, collection, categories },
    ],
    order,
    take: limit,
    skip: (page - 1) * limit,
    relations: { categories: true },
  })
}
