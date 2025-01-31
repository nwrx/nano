import type { UserObject } from '@nwrx/api'
import type { RouteRequestData } from '@unserved/client'
import type { application } from '~/server'
import { useAlerts, useClient } from '#imports'

type Options = Omit<RouteRequestData<typeof application, 'GET /api/users/:username'>, 'username'>
type SetProfileOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/profile'>, 'username'>
type SetAvatarOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/avatar'>, 'username'>
type SetPasswordOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/password'>, 'username'>

/**
 * Fetch the current user data from the API and provide methods to interact with it.
 *
 * @param username The username of the user to fetch.
 * @param options The options to pass to the request.
 * @returns The user data and methods to interact with it.
 */
export function useUser(username: MaybeRef<string | undefined>, options: Options = {}) {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref<UserObject>({} as UserObject)

  const refresh = async() => {
    await client.requestAttempt('GET /api/users/:username', {
      onData: user => data.value = user,
      onError: error => showError(error),
      data: {
        username: unref(username),
        ...options,
      },
    })
  }

  return {
    data: toReactive(data) as UserObject,

    /**
     * Refresh the current user data. This will fetch the user data from the API and update the reactive data.
     *
     * @returns A promise that resolves when the request is complete.
     */
    refresh,

    /**
     * Set the user profile data to the given value.
     *
     * @param options The options to pass to the request.
     * @returns A promise that resolves when the request is complete.
     */
    async setProfile(options: SetProfileOptions) {
      await client.requestAttempt('PUT /api/users/:username/profile', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('Profile updated successfully.')
          void refresh()
        },
        data: {
          username: unref(username),
          ...options,
        },
      })
    },

    /**
     * Set the user avatar to the given file.
     *
     * @param options The options to pass to the request.
     * @returns A promise that resolves when the request is complete.
     */
    async setAvatar(options: SetAvatarOptions) {
      await client.requestAttempt('PUT /api/users/:username/avatar', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('Avatar updated successfully.')
          void refresh()
        },
        data: {
          username: unref(username),
          ...options,
        },
      })
    },

    /**
     * Set the user password to the given value.
     *
     * @param options The options to pass to the request.
     * @returns A promise that resolves when the request is complete.
     */
    async setPassword(options: SetPasswordOptions) {
      await client.requestAttempt('PUT /api/users/:username/password', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('Password updated successfully.')
          void refresh()
        },
        data: {
          username: unref(username),
          ...options,
        },
      })
    },
  }
}
