import type { IconFetchOptions } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { createCachedComposable } from '../createCachedComposable'
import { useClient } from '../useClient'

export const useIcons = createCachedComposable(
  () => {
    const client = useClient()
    const data = ref([]) as Ref<string[]>
    const options = ref<IconFetchOptions>({})
    const lock = createResolvable<void>()
    lock.resolve()

    return toReactive({
      data,
      options,

      searchIcons: async(allowCache = false) => {
        if (allowCache && data.value.length > 0) return
        if (lock.isPending) return lock.promise
        lock.reset()
        options.value.page = 1
        await client.requestAttempt(
          'GET /icons',
          {
            query: { ...options.value },
            onData: (icons) => { data.value = icons },
            onEnd: () => lock.resolve(),
          },
        )
      },

      loadMoreIcons: async() => {
        options.value.page ??= 1
        options.value.page += 1
        await client.requestAttempt(
          'GET /icons',
          {
            query: { ...options.value },
            onData: (icons) => {
              data.value = [...data.value, ...icons]
            },
          },
        )
      },
    })
  },
  {
    cacheKey: () => 'default',
    isPersistent: true,
  },
)
