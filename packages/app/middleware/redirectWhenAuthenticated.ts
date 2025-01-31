import { useClient } from '#imports'

export default defineNuxtRouteMiddleware(async() => {
  const { username } = await useClient().request('GET /api/session')
  if (username) return navigateTo({ name: 'Workspace', params: { workspace: username } })
})
