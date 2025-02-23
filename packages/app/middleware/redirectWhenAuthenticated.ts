export default defineNuxtRouteMiddleware(async() => {
  const session = await useSession().getSession()
  if (session) return navigateTo({ name: 'Workspace', params: { workspace: session.username } })
})
