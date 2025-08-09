import type { application } from '@nwrx/nano-api'
import type { Channels, Routes } from '@unserved/client'
import type { Client } from '@unshared/client'
import { createClient } from '@unshared/client'

export const useClient = createSharedComposable(() => createClient({
  baseUrl: useRuntimeConfig().public.apiUrl || useRequestURL().origin,
  credentials: useRuntimeConfig().public.apiUrl ? 'include' : 'same-origin',

  onFailure: async(response) => {
    const alerts = useAlerts()
    try {
      const { data } = await response.json() as { data: Error }
      alerts.error({
        title: data.name && data.name !== 'Error' ? data.name : response.statusText,
        text: data.message,
        type: 'error',
      })
    }
    catch {
      alerts.error({
        title: response.statusText,
        text: response.url,
        type: 'error',
      })
    }
  },

})) as <T = typeof application>() => Client<Routes<T>, Channels<T>>
