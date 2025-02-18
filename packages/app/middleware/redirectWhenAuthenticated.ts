export default defineNuxtRouteMiddleware(async() => {
  const session = await useSession().refresh()
  if (session) return navigateTo({ name: 'Workspace', params: { workspace: session.username } })
})
