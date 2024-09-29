export default defineNuxtRouteMiddleware(async() => {
  const { username } = await useSession().refresh()
  if (username) return navigateTo({ name: 'Workspace', params: { workspace: username } })
})
