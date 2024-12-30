import { createHttpRoute } from '@unserved/server'

export function ping() {
  return createHttpRoute(
    {
      name: 'GET /ping',
    },
    async({ event }) => ({ status: 'pong' }),
  )
}
