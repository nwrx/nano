import type { ThreadRunnerStatus } from '@nwrx/nano-api'
import { useAlerts, useClient } from '#imports'

/** Polling interval in milliseconds */
const POLL_INTERVAL = 5000

/**
 * Composable to manage thread runners. Provides methods to fetch, subscribe to,
 * and manage thread runner servers. This composable is used to fetch the list of
 * thread runners from the server and provide a reactive object that can be used
 *
 * @returns The reactive object containing the thread runners and methods to interact with them.
 * @example useThreadRunners() // { data, refresh, subscribe, unsubscribe, claim, release }
 */
export const useThreadRunners = createSharedComposable(() => {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref([]) as Ref<ThreadRunnerStatus[]>
  const statues = reactive({}) as Record<string, ThreadRunnerStatus>
  const pollingIntervals = new Map<string, NodeJS.Timeout>()

  // --- Fetch the list of thread runners from the server.
  const refresh = async() => {
    await client.requestAttempt('GET /api/runners', {
      onError: error => showError(error),
      onData: runners => data.value = runners,
    })
  }

  const getStatus = async(runner: string) => {
    await client.requestAttempt('GET /api/runners/:runner', {
      data: { runner },
      onData: (status) => { statues[runner] = status },
    })
  }

  const unsubscribe = (runner: string) => {
    const interval = pollingIntervals.get(runner)
    if (!interval) return
    clearInterval(interval)
    pollingIntervals.delete(runner)
  }

  const subscribe = (runner: string) => {
    if (pollingIntervals.has(runner)) return
    const interval = setInterval(() => { void getStatus(runner) }, POLL_INTERVAL)
    pollingIntervals.set(runner, interval)
  }

  // --- Clear all polling intervals when the composable is disposed.
  tryOnScopeDispose(() => {
    for (const interval of pollingIntervals.values())
      clearInterval(interval)
  })

  return {
    data,
    refresh,

    /**
     * Start polling a thread runner's status
     *
     * @param runnerId The UUID of the runner to poll
     */
    subscribe,

    /**
     * Stop polling a thread runner's status
     *
     * @param runnerId The UUID of the runner to stop polling
     */
    unsubscribe,

    /**
     * Register a new thread runner server
     *
     * @param address The base URL of the runner server to register
     */
    claim: async(address: string) => {
      await client.requestAttempt('POST /api/runners', {
        data: { address },
        onSuccess: async() => {
          alerts.success('Runner server claimed successfully')
          await refresh()
        },
      })
    },

    /**
     * Unregister a thread runner server
     *
     * @param runnerId The UUID of the runner to unregister
     */
    release: async(runnerId: string) => {
      await client.requestAttempt('DELETE /api/runners/:runner', {
        data: { runner: runnerId },
        onSuccess: async() => {
          alerts.success('Runner server unregistered successfully')
          // unsubscribe(runnerId)
          await refresh()
        },
      })
    },
  }
})
