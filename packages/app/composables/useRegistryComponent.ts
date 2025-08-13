import type { application, RegistryComponentObject } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'

export type GetComponentOptions = RouteRequestQuery<typeof application, 'GET /workspaces/:workspace/collection/:collection/component/:component'>

export function useRegistryComponent(
  workspace: MaybeRef<string>,
  component: MaybeRef<string>,
  options: GetComponentOptions = {},
) {
  const client = useClient()
  const data = ref<RegistryComponentObject>({} as RegistryComponentObject)

  const getComponent = async() => {
    await client.requestAttempt('GET /workspaces/:workspace/collection/:collection/component/:component', {
      data: {
        workspace: unref(workspace),
        component: unref(component),
        ...options,
      },
      onData: (component) => {
        data.value = component
      },
    })
  }

  return {
    data,
    getComponent,
  }
}
