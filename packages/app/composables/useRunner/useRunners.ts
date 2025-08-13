import type { RunnerObject } from '@nwrx/nano-api'
import type { UseRunner } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { useAlerts } from '@unshared/vue/useAlerts'
import { useClient } from '../useClient'

export const useRunners = createCachedComposable(
  () => {
    const client = useClient()
    const alerts = useAlerts()
    const options = ref({}) as Ref<UseRunner.SearchOptions>
    const data = ref([]) as Ref<RunnerObject[]>
    const lock = createResolvable<void>()
    const subscribers = ref(0)
    let abortController = new AbortController()
    lock.resolve()

    return toReactive({
      data,
      options,

      search: async() => {
        if (lock.isPending) return lock.promise
        await client.request(
          'GET /runners',
          {
            query: { ...options.value },
            onData: runners => data.value = runners,
            onEnd: () => lock.resolve(),
          },
        )
      },

      register: async(options: UseRunner.RegisterOptions) => {
        await client.requestAttempt(
          'POST /runners',
          {
            body: { ...options },
            onSuccess: () => {
              alerts.success(localize({
                en: 'The runner has been registered successfully',
                fr: 'Le runner a été enregistré avec succès',
                de: 'Der Runner wurde erfolgreich registriert',
                es: 'El runner se ha registrado correctamente',
                zh: '运行器已成功注册',
              }))
            },
          },
        )
      },

      subscribeToEvents: () => {
        subscribers.value++
        if (subscribers.value > 1) return
        void client.requestAttempt(
          'GET /runners/events',
          {
            signal: abortController.signal,
            onData: ({ data: eventData }) => {
              if (eventData.event === 'runners.created') {
                data.value.push(eventData.data)
                data.value = [...data.value] // Trigger reactivity
              }
              else if (eventData.event === 'runners.updated') {
                const runner = data.value.find(runner => runner.name === eventData.data.name)
                if (!runner) return
                Object.assign(runner, { ...runner, ...eventData.data })
                data.value = [...data.value] // Trigger reactivity
              }
              else if (eventData.event === 'runners.removed') {
                data.value = data.value.filter(runner => runner.name !== eventData.data.name)
                data.value = [...data.value] // Trigger reactivity
              }
            },
            onEnd: () => {
              subscribers.value = 0 // Reset subscribers when the stream ends
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
    })
  },
  {
    cacheKey: () => 'runners',
  },
)
