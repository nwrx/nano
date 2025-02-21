import type { ModuleRunner } from '../application'
import { createHttpRoute } from '@unserved/server'

export function ping(this: ModuleRunner) {
  return createHttpRoute(
    { name: 'GET /ping' },
    () => new Uint8Array() as unknown as void,
  )
}
