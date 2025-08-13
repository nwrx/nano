import type { FindOptionsOrder } from 'typeorm'
import type { ModuleRegistry } from '..'
import type { RegistryComponent, RegistryComponentObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRegistryCategory, getRegistryCollection, searchRegistryComponent } from '../utils'

export function registryComponentSearch(this: ModuleRegistry) {
  return createHttpRoute(
    {
      name: 'GET /registry',
      parseQuery: createParser({
        workspace: [[assert.undefined], [assert.stringNotEmpty]],
        collection: [[assert.undefined], [assert.stringNotEmpty]],
        categories: [[assert.undefined], [assert.stringNotEmpty]],
        search: [[assert.undefined], [assert.string]],
        page: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<RegistryComponent>]],
        withInputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withOutputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query }): Promise<RegistryComponentObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })

      // --- Get the workspace and assert that the user has access to it.
      const workspace = query.workspace ? await moduleWorkspace.getWorkspace({ user, name: query.workspace, permission: 'Read' }) : undefined
      const collection = query.collection && workspace ? await getRegistryCollection.call(this, { name: query.collection, workspace }) : undefined
      const categories = query.categories ? await getRegistryCategory.call(this, { name: query.categories }) : undefined

      // --- Search the registry collection with the given query.
      const components = await searchRegistryComponent.call(this, {
        workspace,
        collection,
        categories,
        search: query.search,
        page: query.page,
        limit: query.limit,
        order: query.order,
      })

      return components.map(collection => collection.serialize({
        withInputs: query.withInputs,
        withOutputs: query.withOutputs,
      }))
    },
  )
}
