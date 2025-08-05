import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { ModuleUser } from '../../user'

export function runnerEvents(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/events',
    },
    async({ event }) => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()
      return this.events.subscribe(event)
    },
  )
}
