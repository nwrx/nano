import type { ModuleIconCollection } from '../index'
import { createHttpRoute } from '@unserved/server'
import { ModuleUser } from '../../user'
import { refreshCollections } from '../utils'

export function iconCollectionRefresh(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'POST /api/icons/collections/refresh',
    },
    async({ event }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Refresh collections from the remote Iconify API.
      await refreshCollections.call(this, { user })
    },
  )
}
