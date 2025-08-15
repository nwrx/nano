import type { application } from '@nwrx/nano-api'
import type { Channels, Routes } from '@unserved/client'
import type { Client } from '@unshared/client'
import { createClient } from '@unshared/client'

export const useClient = createSharedComposable(() => createClient({
  baseUrl: useRuntimeConfig().public.apiUrl || useRequestURL().origin,
  credentials: useRuntimeConfig().public.apiUrl ? 'include' : 'same-origin',

  onFailure: async(response) => {
    const { stack, data } = await response.json() as { stack?: string; data: Error }
    useAlerts().error({
      title: data.name,
      text: data.message,
      type: 'error',
    })
    throw createError({
      name: data.name,
      stack,
      message: data.message,
      statusCode: response.status,
      statusMessage: response.statusText,
    })

  },
  // onError: (error) => {
  //   const alerts = useAlerts()
  //   alerts.error({
  //     title: error.name,
  //     text: error.message,
  //     type: 'error',
  //   })
  // },

})) as <T = typeof application>() => Client<Routes<T>, Channels<T>>
