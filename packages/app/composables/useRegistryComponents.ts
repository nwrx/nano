import type { application, RegistryComponentObject } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'

export type UseRegistryComponentsOptions = RouteRequestQuery<typeof application, 'GET /api/registry'>

export function useRegistryComponents(
  workspace: MaybeRef<string>,
  collection: MaybeRef<string>,
  options: MaybeRef<UseRegistryComponentsOptions> = {},
) {
  const client = useClient()
  const data = ref<RegistryComponentObject[]>([])

  const searchComponents = async() => {
    await client.requestAttempt('GET /api/registry', {
      data: {
        workspace: unref(workspace),
        collection: unref(collection),
        ...unref(options),
      },
      onData: (components) => {
        data.value = components
      },
    })
  }

  return {
    data,
    searchComponents,
  }
}
