import type { UserObject } from '@nwrx/api'
import type { InferInput } from '@unserved/client'
import type { application } from '~/server'
import { useAlerts, useClient } from '#imports'

type UseUserOptions = Omit<InferInput<typeof application, 'GET /api/users/:username'>, 'username'>
export type UserSetProfileOptions = Omit<InferInput<typeof application, 'PUT /api/users/:username/profile'>, 'username'>
export type UserSetAvatarOptions = Omit<InferInput<typeof application, 'PUT /api/users/:username/avatar'>, 'username'>
export type UserSetPasswordOptions = Omit<InferInput<typeof application, 'PUT /api/users/:username/password'>, 'username'>

/**
 * Fetch the current user data from the API and provide methods to interact with it.
 *
 * @param username The username of the user to fetch.
 * @param options The options to pass to the request.
 * @returns The user data and methods to interact with it.
 */
export function useUser(username: MaybeRef<string>, options: UseUserOptions = {}) {
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
    refresh,

    /**
     * Set the user profile data to the given value.
     *
     * @param options The options to pass to the request.
     * @returns A promise that resolves when the request is complete.
     */
    async setProfile(options: UserSetProfileOptions) {
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
    async setAvatar(options: UserSetAvatarOptions) {
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
    async setPassword(options: UserSetPasswordOptions) {
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
