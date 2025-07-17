import type { IconCollectionObject } from '../entities'
import type { ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getCollection } from '../utils'

export function iconCollectionGet(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'GET /api/icons/collections/:name',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
    },
    async({ event, parameters }): Promise<IconCollectionObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { name } = parameters

      // --- Get local collection from database
      const collection = await getCollection.call(this, { user, name })
      return collection.serialize()
    },
  )
}
