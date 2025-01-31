import { createHttpRoute } from '@unserved/server'

export function claim() {
  return createHttpRoute(
    {
      name: 'GET /claim',
    },
    () => ({ status: 'connected' }),
  )
}
