import type { ModuleRunner } from '../module'
import { createHttpRoute } from '@unserved/server'
import { authorize } from '../utils'

export function ping(this: ModuleRunner) {
  return createHttpRoute(
    { name: 'GET /ping' },
    ({ event }) => {
      authorize.call(this, event)
      return { ok: true }
    },
  )
}
