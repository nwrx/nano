import type { application, RegistryCategoryObject } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'

export type UseRegistryCategoriesOptions = RouteRequestQuery<typeof application, 'GET /api/registry/categories'>

export function useRegistryCategories(options: UseRegistryCategoriesOptions = {}) {
  const client = useClient()
  const categories = ref<RegistryCategoryObject[]>([])

  const searchCategories = async() => {
    await client.requestAttempt('GET /api/registry/categories', {
      data: options,
      onData: data => categories.value = data,
    })
  }

  return {
    categories,
    searchCategories,
  }
}
