import type { FindOptionsOrder } from 'typeorm'
import type { ModuleRegistry } from '..'
import type { RegistryCollection, RegistryCollectionObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRegistryCategory, searchRegistryCollection } from '../utils'

export function registryCollectionSearch(this: ModuleRegistry) {
  return createHttpRoute(
    {
      name: 'GET /api/registry/collections',
      parseQuery: createParser({
        workspace: [[assert.undefined], [assert.stringNotEmpty]],
        categories: [[assert.undefined], [assert.stringNotEmpty, (value: string) => value.toString().split(',')]],
        search: [[assert.undefined], [assert.string]],
        page: [[assert.undefined], [assert.stringNotEmpty, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNotEmpty, Number.parseInt]],
        order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<RegistryCollection>]],
        withCategories: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withComponents: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withWorkspace: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query }): Promise<RegistryCollectionObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })

      // --- Get the workspace and assert that the user has access to it.
      const workspace = query.workspace ? await moduleWorkspace.getWorkspace({ user, name: query.workspace, permission: 'Read' }) : undefined

      // --- Get all categories specified in the query.
      const promises = query.categories ? query.categories.map(name => getRegistryCategory.call(this, { name })) : []
      const categories = query.categories ? await Promise.all(promises) : undefined

      // --- Search the registry collection with the given query.
      const collections = await searchRegistryCollection.call(this, {
        workspace,
        categories,
        search: query.search,
        page: query.page,
        limit: query.limit,
        order: query.order,
        withCategories: query.withCategories,
        withComponents: query.withComponents,
        withWorkspace: query.withWorkspace,
      })

      // --- Serialize the collections and return them.
      return collections.map(collection => collection.serialize({
        withCategories: query.withCategories,
        withComponents: query.withComponents,
        withWorkspace: query.withWorkspace,
      }))
    },
  )
}
