import type { RegistryCollectionObject } from '../entities'
import type { ModuleRegistry } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRegistryCollection } from '../utils'

export function registryCollectionGet(this: ModuleRegistry) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/collections/:collection',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        collection: assert.stringNotEmpty,
      }),
      parseQuery: createSchema({
        withComponents: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withCategories: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withInputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withOutputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<RegistryCollectionObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })

      // --- Get the workspace and collection.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const collection = await getRegistryCollection.call(this, {
        workspace,
        name: parameters.collection,
        withComponents: query.withComponents,
        withCategories: query.withCategories,
      })

      // --- Return the serialized collection.
      return collection.serialize({
        withComponents: query.withComponents,
        withCategories: query.withCategories,
        withInputs: query.withInputs,
        withOutputs: query.withOutputs,
      })
    },
  )
}
