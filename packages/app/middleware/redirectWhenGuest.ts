export default defineNuxtRouteMiddleware(async({ path }) => {
  const session = await useSession().getSession()
  if (!session) return navigateTo({ name: 'Authentication', query: { redirect: path } })
})
