import type { application, RegistryCollectionObject } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'

export type GetCollectionOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/collections/:collection'>

export function useRegistryCollection(
  workspace: MaybeRef<string>,
  collection: MaybeRef<string>,
  options: GetCollectionOptions = {},
) {
  const client = useClient()
  const data = ref<RegistryCollectionObject>({} as RegistryCollectionObject)

  const getCollection = async() => {
    await client.requestAttempt('GET /api/workspaces/:workspace/collections/:collection', {
      data: {
        workspace: unref(workspace),
        collection: unref(collection),
        ...options,
      },
      onData: collection => data.value = collection,
    })
  }

  return {
    data,
    getCollection,
  }
}
