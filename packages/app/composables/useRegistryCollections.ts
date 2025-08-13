import type { application, RegistryCollectionObject } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'

export type UseRegistryCollectionsOptions = RouteRequestQuery<typeof application, 'GET /registry/collections'>

export function useRegistryCollections(options: MaybeRef<UseRegistryCollectionsOptions> = {}) {
  const client = useClient()
  const collections = ref<RegistryCollectionObject[]>([])

  const searchCollections = async() => {
    await client.requestAttempt('GET /registry/collections', {
      data: unref(options),
      onData: data => collections.value = data,
    })
  }

  return {
    data: collections,
    searchCollections,
  }
}
