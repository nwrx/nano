import { useClient } from '#imports'

export default defineNuxtRouteMiddleware(async({ path }) => {
  const { username } = await useClient().request('GET /api/session')
  // if (!username) return navigateTo(`/auth/signin?redirect=${path}`)
  if (!username) return navigateTo({ name: 'Authentication', query: { redirect: path } })
})
