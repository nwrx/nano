import type { UserObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'
import type { application } from '~/server'
import { useAlerts, useClient } from '#imports'

const LOCALES = {
  en: {
    'user.created': 'User created successfully.',
    'user.disabled': 'User disabled successfully.',
    'user.enabled': 'User enabled successfully.',
    'user.deleted': 'User deleted successfully.',
    'user.verified': 'User verified successfully.',
  },
  fr: {
    'user.created': 'Utilisateur créé avec succès.',
    'user.disabled': 'Utilisateur désactivé avec succès.',
    'user.enabled': 'Utilisateur activé avec succès.',
    'user.deleted': 'Utilisateur supprimé avec succès.',
    'user.verified': 'Utilisateur vérifié avec succès.',
  },
  de: {
    'user.created': 'Benutzer erfolgreich erstellt.',
    'user.disabled': 'Benutzer erfolgreich deaktiviert.',
    'user.enabled': 'Benutzer erfolgreich aktiviert.',
    'user.deleted': 'Benutzer erfolgreich gelöscht.',
    'user.verified': 'Benutzer erfolgreich verifiziert.',
  },
  es: {
    'user.created': 'Usuario creado correctamente.',
    'user.disabled': 'Usuario deshabilitado correctamente.',
    'user.enabled': 'Usuario habilitado correctamente.',
    'user.deleted': 'Usuario eliminado correctamente.',
    'user.verified': 'Usuario verificado correctamente.',
  },
  zh: {
    'user.created': '用户已成功创建。',
    'user.disabled': '用户已成功禁用。',
    'user.enabled': '用户已成功启用。',
    'user.deleted': '用户已成功删除。',
    'user.verified': '用户已成功验证。',
  },
}

/** The options to fetch the users with. */
type UseUserOptions = RouteRequestData<typeof application, 'GET /api/users'>
export type UserCreateOptions = RouteRequestData<typeof application, 'POST /api/users'>

/**
 * Fetch a list of users from the server. This composable is used to fetch the list of users
 * from the server and provide a reactive object that can be used to display the users in the UI.
 * It also provides methods to create, update, and delete users.
 *
 * @param options The options to fetch the users with.
 * @returns The reactive object containing the users and methods to interact with them.
 */
export function useUsers(options: UseUserOptions = {}) {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref([]) as Ref<UserObject[]>
  const { t } = useI18n({ messages: LOCALES })

  const refresh = async() => {
    await client.requestAttempt('GET /api/users', {
      onError: error => showError(error),
      onData: users => data.value = users,
      data: { ...options },
    })
  }

  return {
    data,
    refresh,

    /**
     * Create a new user with the given data. This will create a new user in the database with the
     * given `username`, `email`. The `username` must be unique and the `email` must
     * be a valid email address. Note that this method is only available to super administrators.
     *
     * @param options The options to create the user with.
     * @returns A promise that resolves when the user has been created.
     */
    create: async(options: UserCreateOptions) => {
      await client.requestAttempt('POST /api/users', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success(t('user.created')),
        onEnd: () => refresh(),
        data: options,
      })
    },

    /**
     * Disables the user with the given username. This will set the `disabledAt` field of the user
     * to the current date and time in the database. Effectively preventing the user from logging in.
     *
     * @param username The username of the user to disable.
     * @returns A promise that resolves when the user has been disabled.
     * @example await users.disable('jdoe')
     */
    disable: async(username: string) => {
      await client.requestAttempt('PATCH /api/users/:username/disable', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success(t('user.disabled')),
        onEnd: () => refresh(),
        parameters: { username },
      })
    },

    /**
     * Enables the user with the given username. This will set the `disabledAt` field of the user
     * to `null` in the database. Effectively allowing the user to log in.
     *
     * @param username The username of the user to enable.
     * @returns A promise that resolves when the user has been enabled.
     * @example await users.enable('jdoe')
     */
    enable: async(username: string) => {
      await client.requestAttempt('PATCH /api/users/:username/enable', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success(t('user.enabled')),
        onEnd: () => refresh(),
        data: { username },
      })
    },

    /**
     * Deletes the user with the given username. This will remove the user from the database.
     *
     * @param username The username of the user to delete.
     * @returns A promise that resolves when the user has been deleted.
     * @example await users.delete('jdoe')
     */
    delete: async(username: string) => {
      await client.requestAttempt('DELETE /api/users/:username', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success(t('user.deleted')),
        onEnd: () => refresh(),
        data: { username },
      })
    },

    /**
     * Verify the user with the given username. This will set the `verifiedAt` field of the user
     * to the current date and time in the database. Effectively verifying the user's email address.
     * Note that this method is only available to super administrators.
     *
     * @param username The username of the user to verify.
     * @returns A promise that resolves when the user has been verified.
     * @example await users.verify('jdoe')
     */
    verify: async(username: string) => {
      await client.requestAttempt('PATCH /api/users/:username/verify', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success(t('user.verified')),
        onEnd: () => refresh(),
        data: { username },
      })
    },

    /**
     * Search for users with the given query. This will search for users in the database that match
     * the given `query`. The `query` can be a partial username or email address.
     *
     * @param query The query to search for.
     * @returns A promise that resolves with the list of users that match the query.
     */
    search: async(query: string): Promise<UserObject[]> => await client.request('GET /api/users', {
      onError: error => alerts.error(error),
      data: { query },
    }) as UserObject[],
  }
}
