export default defineNuxtRouteMiddleware(async() => {
  const { username } = await useSession()
  if (username) return navigateTo({ name: 'Workspace', params: { workspace: username } })
})
