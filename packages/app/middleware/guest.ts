import { useClient } from '#imports'

export default defineNuxtRouteMiddleware(async() => {
  const { isAuthenticated } = await useClient().request('OPTIONS /api/me' )
  if (isAuthenticated) return navigateTo('/me')
})
