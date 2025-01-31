const RESERVED_PATH = [
  '/auth',
  '/admin',
  '/profile',
  '/settings',
  '/signin',
  '/signup',
  '/signout',
  '/verify-email',
  '/reset-password',
  '/forgot-password',
]

export default defineNuxtRouteMiddleware(({ path }) => {
  for (const reserved of RESERVED_PATH)
    if (path.startsWith(reserved)) return abortNavigation()
})
