import { useClient } from '#imports'

export default defineNuxtRouteMiddleware(async({ path }) => {
  const { isAuthenticated } = await useClient().request('HEAD /api/session' )
  if (!isAuthenticated) return navigateTo(`/auth/signin?redirect=${path}`)
})
