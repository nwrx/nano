import type { Channels, Routes } from '@unserved/client'
import type { Client } from '@unshared/client'
import type { application } from '~/server'
import { createClient } from '@unshared/client'

export const useClient = createSharedComposable(() => createClient({
  baseUrl: useRequestURL({ xForwardedHost: true, xForwardedProto: true }).origin,
})) as () => Client<Routes<typeof application>, Channels<typeof application>>
