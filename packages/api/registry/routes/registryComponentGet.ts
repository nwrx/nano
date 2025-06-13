import type { RegistryComponentObject } from '../entities'
import type { ModuleRegistry } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRegistryCollection, getRegistryComponent } from '../utils'

export function registryComponentGet(this: ModuleRegistry) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/collection/:collection/component/:component',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        collection: assert.stringNotEmpty,
        component: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withInputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withOutputs: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<RegistryComponentObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event, { optional: true })

      // --- Get the workspace and component
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const collection = await getRegistryCollection.call(this, { name: parameters.collection, workspace })
      const component = await getRegistryComponent.call(this, { name: parameters.component, workspace, collection })

      // --- Return the serialized component
      return component.serialize({
        withInputs: query.withInputs,
        withOutputs: query.withOutputs,
      })
    },
  )
}
