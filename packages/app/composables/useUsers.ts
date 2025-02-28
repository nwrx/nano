import type { application, UserObject } from '@nwrx/nano-api'
import type { RouteRequestBody, RouteRequestQuery } from '@unserved/client'
import { useAlerts, useClient } from '#imports'

export type UseUserOptions = RouteRequestQuery<typeof application, 'GET /api/users'>
export type UserCreateOptions = RouteRequestBody<typeof application, 'POST /api/users'>

export function useUsers(options: MaybeRef<UseUserOptions>) {
  const client = useClient()
  const alerts = useAlerts()
  const users = ref([]) as Ref<UserObject[]>

  const getUsers = async() => {
    await client.requestAttempt('GET /api/users', {
      data: { ... unref(options) },
      onData: data => users.value = data,
    })
  }

  return {
    users,
    getUsers,

    create: async(options: UserCreateOptions) => {
      await client.requestAttempt('POST /api/users', {
        data: options,
        onSuccess: async() => {
          await getUsers()
          alerts.success(localize({
            en: `The "${options.username}" user has been created successfully`,
            fr: `L'utilisateur "${options.username}" a été créé avec succès`,
            de: `Der Benutzer "${options.username}" wurde erfolgreich erstellt`,
            es: `El usuario "${options.username}" se ha creado correctamente`,
            zh: `"${options.username}" 用户已成功创建`,
          }))
        },
      })
    },

    disable: async(username: string) => {
      await client.requestAttempt('POST /api/users/:username/disable', {
        parameters: { username },
        onSuccess: async() => {
          await getUsers()
          alerts.success(localize({
            en: `The "${username}" user has been disabled successfully`,
            fr: `L'utilisateur "${username}" a été désactivé avec succès`,
            de: `Der Benutzer "${username}" wurde erfolgreich deaktiviert`,
            es: `El usuario "${username}" se ha desactivado correctamente`,
            zh: `"${username}" 用户已成功禁用`,
          }))
        },
      })
    },

    enable: async(username: string) => {
      await client.requestAttempt('POST /api/users/:username/enable', {
        parameters: { username },
        onSuccess: async() => {
          await getUsers()
          alerts.success(localize({
            en: `The "${username}" user has been enabled successfully`,
            fr: `L'utilisateur "${username}" a été activé avec succès`,
            de: `Der Benutzer "${username}" wurde erfolgreich aktiviert`,
            es: `El usuario "${username}" se ha habilitado correctamente`,
            zh: `"${username}" 用户已成功启用`,
          }))
        },
      })
    },

    remove: async(username: string) => {
      await client.requestAttempt('DELETE /api/users/:username', {
        parameters: { username },
        onSuccess: async() => {
          await getUsers()
          alerts.success(localize({
            en: `The "${username}" user has been deleted successfully`,
            fr: `L'utilisateur "${username}" a été supprimé avec succès`,
            de: `Der Benutzer "${username}" wurde erfolgreich gelöscht`,
            es: `El usuario "${username}" se ha eliminado correctamente`,
            zh: `"${username}" 用户已成功删除`,
          }))
        },
      })
    },

    verify: async(username: string) => {
      await client.requestAttempt('POST /api/users/:username/verify', {
        parameters: { username },
        onSuccess: async() => {
          await getUsers()
          alerts.success(localize({
            en: `The "${username}" user has been verified successfully`,
            fr: `L'utilisateur "${username}" a été vérifié avec succès`,
            de: `Der Benutzer "${username}" wurde erfolgreich verifiziert`,
            es: `El usuario "${username}" se ha verificado correctamente`,
            zh: `"${username}" 用户已成功验证`,
          }))
        },
      })
    },
  }
}
