import type { EventStream } from '@unserved/server'
import type { ModuleIconCollection } from '..'
import type { IconCollectionEvents } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { ModuleUser } from '../../user'

export function iconCollectionEvents(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'GET /icons/collections/events',
    },
    async({ event }): Promise<EventStream<IconCollectionEvents>> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

      // --- Subscribe to the icon collection events.
      return this.iconEventBus.subscribe(event)
    },
  )
}
