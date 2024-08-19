import type { UUID } from 'node:crypto'

/**
 * Use the route ID composable. It allows you to get the ID of the current route.
 * If the ID is 'new', it means that the route is for creating a new record.
 *
 * @returns A computed value of the route ID.
 */
export function getRouteId<U extends string = UUID>(): U | undefined {
  let id = useRoute().params.id
  if (Array.isArray(id)) id = id[0]
  if (id === 'new') return
  return id as U
}
