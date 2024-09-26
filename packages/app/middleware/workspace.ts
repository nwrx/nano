const RESERVED_PATH = new Set([
  '/admin',
  '/settings',
])

export default defineNuxtRouteMiddleware(({ path }, _) => {
  if (RESERVED_PATH.has(path)) return abortNavigation()
})
