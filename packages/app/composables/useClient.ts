import type { application } from '@nwrx/nano-api'
import type { Channels, Routes } from '@unserved/client'
import type { Client } from '@unshared/client'
import { createClient } from '@unshared/client'

export const useClient = createSharedComposable(() => createClient({
  baseUrl: useRuntimeConfig().public.apiUrl || useRequestURL().origin,
  credentials: useRuntimeConfig().public.apiUrl ? 'include' : 'same-origin',
})) as () => Client<Routes<typeof application>, Channels<typeof application>>
