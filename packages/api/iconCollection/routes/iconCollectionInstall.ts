import type { ModuleIconCollection } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { installCollection } from '../utils'

export function iconCollectionInstall(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'POST /api/icons/collections/:name',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { name } = parameters

      // --- Create or get the import task for the collection.
      await installCollection.call(this, { name, user })
    },
  )
}
