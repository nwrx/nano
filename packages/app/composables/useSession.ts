import type { UserObject } from '@nwrx/api'
import type { InferInput } from '@unserved/client'
import type { application } from '~/server'
import { useAlerts, useClient, useRouter } from '#imports'

export type SessionSigninCredentials = InferInput<typeof application, 'POST /api/session'>
export type SessionSignupCredentials = InferInput<typeof application, 'POST /api/signup'>

/**
 * Fetch the current session data from the API and provide methods to
 * sign-in, sign-out, and refresh the session data.
 */
export const useSession = createSharedComposable(() => {
  const client = useClient()
  const router = useRouter()
  const alerts = useAlerts()
  const session = ref<Partial<UserObject>>({})

  const refresh = async(force = false) => {
    if (!force && session.value.username) return session.value
    return await client.request('GET /api/session', {
      onData: data => session.value = data,
    })
  }

  return {
    data: toReactive(session),

    /**
     * Refresh the current session data. This will fetch the session data from the API
     * and update the session object with the new data. If the session data is already
     * available, this will not fetch the data again unless the `force` parameter is set.
     *
     * @param force Whether to force the refresh even if the session data is already available.
     * @returns The current session data.
     */
    refresh,

    /**
     * Sign-up the user with the provided credentials.
     *
     * @param credentials The credentials to sign-up with.
     */
    signupWithPassword: async(credentials: SessionSignupCredentials) => {
      await useClient().requestAttempt('POST /api/signup', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success('Account created successfully'),
        onData: () => {
          const redirect = useRoute().query.redirect as string | undefined
          session.value = { username: credentials.username }
          void router.replace(redirect ?? { name: 'Workspace', params: { workspace: session.value.username } })
        },
        data: {
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
          passwordConfirm: credentials.passwordConfirm,
        },
      })
    },

    /**
     * Sign-in the user with the provided credentials.
     *
     * @param credentials The credentials to sign-in with.
     */
    signinWithPassword: async(credentials: SessionSigninCredentials) => {
      await useClient().requestAttempt('POST /api/session', {
        onError: error => alerts.error(error),
        onSuccess: async() => {
          alerts.success('Logged in successfully')
          const redirect = useRoute().query.redirect as string | undefined
          await refresh(true)
          return router.replace(redirect ?? { name: 'Workspace', params: { workspace: session.value.username } })
        },
        data: {
          username: credentials.username,
          password: credentials.password,
        },
      })
    },

    /**
     * Sign-out the current user and redirect to the authentication page.
     * This will also display a success message to the user.
     *
     * @returns The result of the sign-out request.
     */
    signout: async() => {
      await client.requestAttempt('DELETE /api/session', {
        onSuccess: () => alerts.success('You have been signed out'),
        onError: error => alerts.error(error),
        onEnd: () => {
          session.value = {}
          void router.push({ name: 'Authentication' })
        },
      })
    },
  }
})
