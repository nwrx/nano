import type { UserObject } from '@nwrx/api'
import type { InferInput } from '@unserved/client'
import type { application } from '~/server'
import { useClient } from '#imports'

type UseUserOptions = Omit<InferInput<typeof application, 'GET /api/users/:username'>, 'username'>

/**
 * Fetch the current user data from the API and provide methods to interact with it.
 *
 * @param username The username of the user to fetch.
 * @param options The options to pass to the request.
 * @returns The user data and methods to interact with it.
 */
export function useUser(username: MaybeRef<string>, options: UseUserOptions = {}) {
  const data = ref<UserObject>({} as UserObject)
  const refresh = async() => {
    await useClient().requestAttempt('GET /api/users/:username', {
      onError: error => showError(error),
      onData: user => data.value = user,
      data: {
        username: unref(username),
        ...options,
      },
    })
  }

  return {
    data: toReactive(data) as UserObject,
    refresh,
  }
}
