import { awaitable } from '@unshared/functions'
import { useAlerts, useClient, useRouter } from '#imports'

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
     * Sign-out the current user and redirect to the authentication page.
     * This will also display a success message to the user.
     *
     * @returns The result of the sign-out request.
     */
    signout: () =>
      client.requestAttempt('DELETE /api/session', {
        onSuccess: () => useAlerts().success('You have been signed out'),
        onError: error => useAlerts().error(error),
        onEnd: () => { void router.push({ name: 'Authentication' }) },
      }),
  }, refresh)
})
