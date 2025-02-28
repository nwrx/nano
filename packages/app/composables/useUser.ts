import type { application, UserObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'
import { useAlerts, useClient } from '#imports'

export type UseUsersOptions = Omit<RouteRequestData<typeof application, 'GET /api/users/:username'>, 'username'>
export type SetProfileOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/profile'>, 'username'>
export type SetAvatarOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/avatar'>, 'username'>
export type SetPasswordOptions = Omit<RouteRequestData<typeof application, 'PUT /api/users/:username/password'>, 'username'>

export function useUser(username: MaybeRef<string | undefined>, options: UseUsersOptions = {}) {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref<UserObject>({} as UserObject)

  const getUser = async() => {
    await client.requestAttempt('GET /api/users/:username', {
      data: { username: unref(username), ...options },
      onData: user => data.value = user,
      onError: error => showError(error),
    })
  }

  return {
    data: toReactive(data) as UserObject,
    getUser,

    setProfile: async(options: SetProfileOptions) => {
      await client.requestAttempt('PUT /api/users/:username/profile', {
        data: {
          username: unref(username),
          ...options,
        },
        onSuccess: async() => {
          await getUser()
          alerts.success(localize({
            en: 'Profile updated successfully.',
            fr: 'Profil mis à jour avec succès.',
            de: 'Profil erfolgreich aktualisiert.',
            es: 'Perfil actualizado con éxito.',
            zh: '个人资料更新成功。',
          }))
        },
      })
    },

    setUsername: async(newUsername?: string) => {
      await client.requestAttempt('PUT /api/users/:username/username', {
        data: {
          username: unref(username),
          newUsername,
        },
        onSuccess: async() => {
          await getUser()
          alerts.success(localize({
            en: 'Username updated successfully.',
            fr: 'Nom d\'utilisateur mis à jour avec succès.',
            de: 'Benutzername erfolgreich aktualisiert.',
            es: 'Nombre de usuario actualizado con éxito.',
            zh: '用户名更新成功。',
          }))
        },
      })
    },

    setAvatar: async(options: SetAvatarOptions) => {
      await client.requestAttempt('PUT /api/users/:username/avatar', {
        data: {
          username: unref(username),
          ...options,
        },
        onSuccess: async() => {
          await getUser()
          alerts.success(localize({
            en: 'Avatar uploaded successfully.',
            fr: 'Avatar téléchargé avec succès.',
            de: 'Avatar erfolgreich hochgeladen.',
            es: 'Avatar subido con éxito.',
            zh: '头像上传成功。',
          }))
        },
      })
    },

    setPassword: async(options: SetPasswordOptions) => {
      await client.requestAttempt('PUT /api/users/:username/password', {
        data: {
          username: unref(username),
          ...options,
        },
        onSuccess: async() => {
          await getUser()
          alerts.success(localize({
            en: 'Password updated successfully.',
            fr: 'Mot de passe mis à jour avec succès.',
            de: 'Passwort erfolgreich aktualisiert.',
            es: 'Contraseña actualizada con éxito.',
            zh: '密码更新成功。',
          }))
        },
      })
    },
  }
}
