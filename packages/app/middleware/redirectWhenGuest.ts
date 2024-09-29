export default defineNuxtRouteMiddleware(async({ path }) => {
  const { username } = await useSession().refresh()
  if (!username) return navigateTo({ name: 'Authentication', query: { redirect: path } })
})
