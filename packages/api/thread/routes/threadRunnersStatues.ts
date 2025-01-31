import type { ModuleThread } from '../index'
import { createHttpRoute } from '@unserved/server'

export function getThreadRunnersStatues(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'GET /api/runners',
    },
    async() => {
      const promises = [...this.threadRunners].map(async([baseUrl, runner]) => ({
        baseUrl,
        status: await runner.getStatus(),
      }))
      return Promise.all(promises)
    },
  )
}
