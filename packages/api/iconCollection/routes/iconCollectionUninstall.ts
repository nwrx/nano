import type { ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { deleteCollection } from '../utils'

export function iconCollectionUninstall(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'DELETE /api/icons/collections/:name',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { name } = parameters

      // --- Delete the icon collection
      await deleteCollection.call(this, { user, name })
    },
  )
}
