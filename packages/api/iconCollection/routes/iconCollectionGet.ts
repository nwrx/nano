import type { IconCollectionMetadata } from '../entities'
import type { ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getCollection, getCollectionRemote } from '../utils'

export function iconCollectionGet(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'GET /api/icons/collections/:name',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
      parseQuery: createParser({
        remote: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<IconCollectionMetadata> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { name } = parameters
      const { remote = false } = query

      // --- Get remote collection from Iconify API
      if (remote) return await getCollectionRemote.call(this, { user, name })

      // --- Get local collection from database
      const collection = await getCollection.call(this, { user, name })
      return collection.metadata
    },
  )
}
