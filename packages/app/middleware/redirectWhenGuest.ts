export default defineNuxtRouteMiddleware(async({ path }) => {
  const session = await useSession().refresh()
  if (!session) return navigateTo({ name: 'Authentication', query: { redirect: path } })
})
