import type { IconCollectionObject, ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { searchCollections } from '../utils'

export function iconCollectionSearch(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'GET /api/icons/collections',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.string]],
        page: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        withCreatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.string, parseBoolean]],
        withDisabledBy: [[assert.undefined], [assert.string, parseBoolean]],
      }),
    },
    async({ event, query }): Promise<IconCollectionObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Search local collections from the database
      const collections = await searchCollections.call(this, { user, ...query })
      return collections.map(collection => collection.serialize())
    },
  )
}
