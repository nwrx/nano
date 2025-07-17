import type { IconCollectionMetadata, ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { searchCollections, searchCollectionsRemote } from '../utils'

export function iconCollectionSearch(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'GET /api/icons/collections',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.string]],
        page: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        remote: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, query }): Promise<IconCollectionMetadata[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { search, page = 1, limit = 50, remote = false } = query

      // --- Search for collections either remotely or locally
      if (remote) return await searchCollectionsRemote.call(this, { user, search })

      // --- Search local collections from the database
      const collections = await searchCollections.call(this, { user, search, limit, page })
      return collections.map(collection => collection.metadata)
    },
  )
}
