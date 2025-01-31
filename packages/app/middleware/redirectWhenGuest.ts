export default defineNuxtRouteMiddleware(async({ path }) => {
  const { username } = await useSession()
  if (!username) return navigateTo({ name: 'Authentication', query: { redirect: path } })
})
