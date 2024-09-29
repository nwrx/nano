import type { InferInput } from '@unserved/client'
import type { application } from '~/server'
import { awaitable } from '@unshared/functions'
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
  const username = ref('')

  const refresh = async() =>
    await client.request('GET /api/session', {
      onError: error => useAlerts().error(error),
      onData: (data) => {
        if (data.username) username.value = data.username
      },
    })

  return awaitable({
    username,
    refresh,

    /**
     * Sign-up the user with the provided credentials.
     *
     * @param credentials The credentials to sign-up with.
     */
    signupWithPassword: async(credentials: SessionSignupCredentials) => {
      await useClient().requestAttempt('POST /api/signup', {
        onError: error => useAlerts().error(error),
        onSuccess: () => {
          useAlerts().success('Account created successfully')
          void useRouter().replace({ name: 'Workspace', params: { workspace: username.value } })
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
        onError: error => useAlerts().error(error),
        onData: () => {
          const redirect = useRoute().query.redirect as string | undefined
          useAlerts().success('Logged in successfully')
          void router.replace(redirect ?? '/')
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
        onSuccess: () => useAlerts().success('You have been signed out'),
        onError: error => useAlerts().error(error),
        onEnd: () => { void router.push({ name: 'Authentication' }) },
      })
    },
  }, refresh)
})
