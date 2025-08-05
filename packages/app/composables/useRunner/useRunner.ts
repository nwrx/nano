import type { RunnerObject, RunnerStatus } from '@nwrx/nano-api'
import type { UseRunner } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'

export const useRunner = createCachedComposable(
  (parameters: UseRunner.UseOptions) => {
    const { name } = parameters
    const client = useClient()
    const alerts = useAlerts()
    const data = ref({}) as Ref<RunnerObject>
    const status = ref({}) as Ref<RunnerStatus>
    const lock = createResolvable<void>()
    lock.resolve()

    // --- Events state.
    const subscribers = ref(0)
    let abortController = new AbortController()

    // --- Status state.
    const subscribersToStatus = ref(0)
    let abortControllerToStatus = new AbortController()

    return toReactive({
      data,

      fetch: async() => {
        if (lock.isPending) return lock.promise
        lock.reset()
        await client.requestAttempt(
          'GET /api/runners/:name',
          {
            parameters: { name },
            onData: runner => data.value = runner,
            onEnd: () => lock.resolve(),
          },
        )
      },

      update: async(options: UseRunner.UpdateOptions) => {
        await client.requestAttempt(
          'PUT /api/runners/:name',
          {
            parameters: { name },
            body: { ...options },
            onSuccess: () => {
              alerts.success(localize({
                en: `The **${name}** runner has been updated successfully`,
                fr: `Le runner **${name}** a été mis à jour avec succès`,
                de: `Der Runner **${name}** wurde erfolgreich aktualisiert`,
                es: `El runner **${name}** ha sido actualizado correctamente`,
                zh: `**${name}** 运行器已成功更新`,
              }))
            },
          },
        )
      },

      rename: async(newName: string) => {
        await client.requestAttempt(
          'PUT /api/runners/:name/rename',
          {
            parameters: { name },
            body: { name: newName },
            onSuccess: () => {
              alerts.success(localize({
                en: `The **${name}** runner has been renamed to **${newName}** successfully`,
                fr: `Le runner **${name}** a été renommé en **${newName}** avec succès`,
                de: `Der Runner **${name}** wurde erfolgreich in **${newName}** umbenannt`,
                es: `El runner **${name}** ha sido renombrado a **${newName}** correctamente`,
                zh: `**${name}** 运行器已成功重命名为 **${newName}**`,
              }))
            },
          },
        )
      },

      disable: async() => {
        await client.requestAttempt(
          'PUT /api/runners/:name/disable',
          {
            parameters: { name },
            onSuccess: () => {
              alerts.success(localize({
                en: `The **${name}** runner has been disabled successfully`,
                fr: `Le runner **${name}** a été désactivé avec succès`,
                de: `Der Runner **${name}** wurde erfolgreich deaktiviert`,
                es: `El runner **${name}** ha sido desactivado correctamente`,
                zh: `**${name}** 运行器已成功禁用`,
              }))
            },
          },
        )
      },

      enable: async() => {
        await client.requestAttempt(
          'PUT /api/runners/:name/enable',
          {
            parameters: { name },
            onSuccess: () => {
              alerts.success(localize({
                en: `The **${name}** runner has been enabled successfully`,
                fr: `Le runner **${name}** a été activé avec succès`,
                de: `Der Runner **${name}** wurde erfolgreich aktiviert`,
                es: `El runner **${name}** ha sido activado correctamente`,
                zh: `**${name}** 运行器已成功启用`,
              }))
            },
          },
        )
      },

      remove: async() => {
        await client.requestAttempt(
          'DELETE /api/runners/:name',
          {
            parameters: { name },
            onSuccess: () => {
              alerts.success(localize({
                en: `The "${data.value.name}" runner has been removed successfully`,
                fr: `Le runner "${data.value.name}" a été supprimé avec succès`,
                de: `Der Runner "${data.value.name}" wurde erfolgreich entfernt`,
                es: `El runner "${data.value.name}" se ha eliminado correctamente`,
                zh: `"${data.value.name}" 运行器已成功删除`,
              }))
            },
          },
        )
      },

      subscribeToEvents: () => {
        subscribers.value++
        if (subscribers.value > 1) return
        void client.requestAttempt(
          'GET /api/runners/:name/events',
          {
            signal: abortController.signal,
            parameters: { name },
            onData: ({ data: eventData }) => {
              if (eventData.event === 'runner.updated') { data.value = { ...data.value, ...eventData.data } }
              else if (eventData.event === 'runner.renamed') { data.value = { ...data.value, name: eventData.data.name } }
              else if (eventData.event === 'runner.removed') { /* No action needed, runner is removed */ }
            },
            onEnd: () => {
              subscribers.value = 0 // Reset subscribers count on end
            },
          },
        ).catch((error: Error) => {
          if (error.name === 'AbortError') return
        })
      },

      unsubscribeFromEvents: () => {
        subscribers.value--
        if (subscribers.value > 0) return
        abortController.abort()
        abortController = new AbortController()
      },

      status,
      subscribeToStatus: () => {
        subscribersToStatus.value++
        if (subscribersToStatus.value > 1) return
        void client.requestAttempt(
          'GET /api/runners/:name/status',
          {
            signal: abortControllerToStatus.signal,
            parameters: { name },
            onData: ({ data }) => {
              status.value = data
            },
            onEnd: () => {
              subscribersToStatus.value = 0 // Reset subscribers count on end
            },
          },
        ).catch((error: Error) => {
          if (error.name === 'AbortError') return
        })
      },

      unsubscribeFromStatus: () => {
        subscribersToStatus.value--
        if (subscribersToStatus.value > 0) return
        abortControllerToStatus.abort()
        abortControllerToStatus = new AbortController()
      },
    })
  },
  {
    cacheKey: ({ name }) => name,
  },
)
