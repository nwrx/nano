import type { application, ModuleUser, UserObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'

type SigninCredentials = RouteRequestData<typeof application, 'POST /session'>
type SignupCredentials = RouteRequestData<typeof application, 'POST /signup'>

export const useSession = createSharedComposable(() => {
  const client = useClient<ModuleUser>()
  const router = useRouter()
  const alerts = useAlerts()
  const session = ref<Partial<UserObject>>({})

  const getSession = async(force = false) => {
    if (!force && session.value.username) return session.value
    return await client.request('GET /session', {
      onData: (data?: UserObject) => session.value = data ?? {},
    })
  }

  return {
    data: toReactive(session),
    getSession,

    signupWithPassword: async(credentials: SignupCredentials) => {
      await useClient().requestAttempt('POST /signup', {
        data: {
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
          passwordConfirm: credentials.passwordConfirm,
        },
        onSuccess: async() => {
          const redirect = useRoute().query.redirect as string | undefined
          session.value = { username: credentials.username }
          await router.replace(redirect ?? { name: 'Workspace', params: { workspace: credentials.username } })
          alerts.success(localize({
            en: 'You have been signed up successfully',
            fr: 'Vous avez été inscrit avec succès',
            de: 'Sie wurden erfolgreich angemeldet',
            es: 'Te has registrado correctamente',
            zh: '您已成功注册',
          }))
        },
      })
    },

    signinWithPassword: async(credentials: SigninCredentials) => {
      await useClient().requestAttempt('POST /session', {
        data: {
          username: credentials.username,
          password: credentials.password,
        },
        onSuccess: async() => {
          const redirect = useRoute().query.redirect as string | undefined
          await getSession(true)
          await router.replace(redirect ?? { name: 'Workspace', params: { workspace: credentials.username } })
          alerts.success(localize({
            en: 'You have been signed in successfully',
            fr: 'Vous avez été connecté avec succès',
            de: 'Sie wurden erfolgreich angemeldet',
            es: 'Has iniciado sesión correctamente',
            zh: '您已成功登录',
          }))
        },
      })
    },

    signout: async() => {
      await client.requestAttempt('DELETE /session', {
        onEnd: async() => {
          session.value = {}
          await router.push({ name: 'Authentication' })
        },
        onSuccess: () => {
          alerts.success(localize({
            en: 'You have been signed out successfully',
            fr: 'Vous avez été déconnecté avec succès',
            de: 'Sie wurden erfolgreich abgemeldet',
            es: 'Has cerrado sesión correctamente',
            zh: '您已成功退出',
          }))
        },
      })
    },
  }
})
