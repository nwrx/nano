import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { getRequestIP } from 'h3'
import { authorize } from '../utils'

export function claim(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'POST /claim',
    },
    ({ event }) => {
      authorize.call(this, event)
      const address = getRequestIP(event)
      if (!address) throw this.errors.NOT_AUTHORIZED(this.name)
      this.isClaimed = true
      return { name: this.name }
    },
  )
}
