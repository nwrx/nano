import type { FindOptionsOrder } from 'typeorm'
import type { ModuleRegistry } from '..'
import type { RegistryCategoryObject, RegistryComponent } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { assertRegistryCategoryType, searchRegistryCategory } from '../utils'

export function registryCategorySearch(this: ModuleRegistry) {
  return createHttpRoute(
    {
      name: 'GET /api/registry/categories',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.string]],
        type: [[assert.undefined], [assertRegistryCategoryType]],
        page: [[assert.undefined], [assert.stringNotEmpty, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNotEmpty, Number.parseInt]],
        order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<RegistryComponent>]],
        withWorkspace: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCollection: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withComponents: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withInputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withOutputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ query }): Promise<RegistryCategoryObject[]> => {

      // --- Search the registry collection with the given query.
      const categories = await searchRegistryCategory.call(this, {
        search: query.search,
        type: query.type,
        page: query.page,
        limit: query.limit,
        order: query.order,
        withComponents: query.withComponents,
        withCollection: query.withCollection,
        withWorkspace: query.withWorkspace,
      })

      // --- Serialize the categories and return them.
      return categories.map(category => category.serialize({
        withComponents: query.withComponents,
        withInputs: query.withInputs,
        withOutputs: query.withOutputs,
        withWorkspace: query.withWorkspace,
        withCollection: query.withCollection,
      }))
    },
  )
}
