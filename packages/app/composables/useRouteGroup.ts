import type { MaybeRef } from '@vueuse/core'
import type { RouteRecordNormalized } from 'vue-router'
import type { RouteGroup } from '~/utils/types'
import { useRouter } from '#app'

/**
 * Returns all routes that belong to a specific route group.
 *
 * @param group The route group to filter by.
 * @returns An array of route records that belong to the specified group.
 * @example useRouteGroup('nav-group-name')
 */
export function useRouteGroup(group: MaybeRef<RouteGroup>) {
  const router = useRouter()
  const routes = router.getRoutes()
  const groupValue = unref(group)
  const result: RouteRecordNormalized[] = []
  for (const route of routes) {
    const matches = route.meta.groups?.some(x => x === groupValue)
    if (matches) result.push(route)
  }
  return result
}
