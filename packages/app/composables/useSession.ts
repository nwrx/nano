import type { application, UserObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'

type SigninCredentials = RouteRequestData<typeof application, 'POST /api/session'>
type SignupCredentials = RouteRequestData<typeof application, 'POST /api/signup'>

/**
 * Fetch the current session data from the API and provide methods to
 * sign-in, sign-out, and refresh the session data.
 */
export const useSession = createSharedComposable(() => {
  const client = useClient()
  const router = useRouter()
  const alerts = useAlerts()
  const session = ref<Partial<UserObject>>({})

  const getSession = async(force = false) => {
    if (!force && session.value.username) return session.value
    return await client.request('GET /api/session', {
      onData: data => session.value = data ?? {},
    })
  }

  return {
    data: toReactive(session),
    getSession,

    signupWithPassword: async(credentials: SignupCredentials) => {
      await useClient().requestAttempt('POST /api/signup', {
        data: {
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
          passwordConfirm: credentials.passwordConfirm,
        },
        onSuccess: async() => {
          const redirect = useRoute().query.redirect as string | undefined
          session.value = { username: credentials.username }
          await router.replace(redirect ?? { name: 'Workspace', params: { workspace: session.value.username } })
          alerts.success('Account created successfully')
        },
      })
    },

    signinWithPassword: async(credentials: SigninCredentials) => {
      await useClient().requestAttempt('POST /api/session', {
        data: {
          username: credentials.username,
          password: credentials.password,
        },
        onSuccess: async() => {
          const redirect = useRoute().query.redirect as string | undefined
          await getSession(true)
          await router.replace(redirect ?? { name: 'Workspace', params: { workspace: session.value.username } })
          alerts.success('Logged in successfully')
        },
      })
    },

    signout: async() => {
      await client.requestAttempt('DELETE /api/session', {
        onSuccess: () => {
          alerts.success('You have been signed out')
        },
        onEnd: async() => {
          session.value = {}
          await router.push({ name: 'Authentication' })
        },
      })
    },
  }
})
