/* eslint-disable unicorn/no-null */
import type { ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getCollection } from '../utils'

export function iconCollectionEnable(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'POST /api/icons/collections/:name/enable',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { name } = parameters

      // --- Get the icon collection by name
      const collection = await getCollection.call(this, { user, name })
      if (!collection.disabledAt) throw this.errors.ICON_COLLECTION_ALREADY_ENABLED(name)
      collection.disabledAt = null
      collection.disabledBy = null
      collection.updatedBy = user

      // --- Save the updated record.
      const { IconCollection } = this.getRepositories()
      await IconCollection.save(collection)
      await this.iconEventBus.sendMessage({ event: 'enabled', collection: name })
    },
  )
}
