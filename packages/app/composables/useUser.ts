import type { application, UserObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'
import { useAlerts, useClient } from '#imports'

export type Options = Omit<RouteRequestData<typeof application, 'GET /api/users/:username'>, 'username'>
export type SetProfileOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/profile'>, 'username'>
export type SetAvatarOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/avatar'>, 'username'>
export type SetPasswordOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/password'>, 'username'>

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
      data: { username: unref(username), ...options },
      onData: user => data.value = user,
      onError: error => showError(error),
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
    setProfile: async(options: SetProfileOptions) => {
      await client.requestAttempt('PUT /api/users/:username/profile', {
        data: {
          username: unref(username),
          ...options,
        },
        onSuccess: async() => {
          await refresh()
          alerts.success('Profile updated successfully.')
        },
      })
    },

    /**
     * Change the user's username to the given value.
     *
     * @param newUsername The new username to set.
     * @returns A promise that resolves when the request is complete.
     */
    setUsername: async(newUsername?: string) => {
      await client.requestAttempt('PUT /api/users/:username/username', {
        data: {
          username: unref(username),
          newUsername,
        },
        onSuccess: async() => {
          await refresh()
          alerts.success('Username updated successfully.')
        },
      })
    },

    /**
     * Set the user avatar to the given file.
     *
     * @param options The options to pass to the request.
     * @returns A promise that resolves when the request is complete.
     */
    setAvatar: async(options: SetAvatarOptions) => {
      await client.requestAttempt('PUT /api/users/:username/avatar', {
        data: {
          username: unref(username),
          ...options,
        },
        onSuccess: async() => {
          await refresh()
          alerts.success('Avatar updated successfully.')
        },
      })
    },

    /**
     * Set the user password to the given value.
     *
     * @param options The options to pass to the request.
     * @returns A promise that resolves when the request is complete.
     */
    setPassword: async(options: SetPasswordOptions) => {
      await client.requestAttempt('PUT /api/users/:username/password', {
        data: {
          username: unref(username),
          ...options,
        },
        onSuccess: async() => {
          await refresh()
          alerts.success('Password updated successfully.')
        },
      })
    },
  }
}
