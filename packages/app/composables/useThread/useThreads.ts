import type { ModuleThread } from '@nwrx/nano-api'
import type { ThreadObject } from '@nwrx/nano-api'
import type { UUID } from 'node:crypto'
import type { UseThread } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
// import { useAlerts } from '@unshared/vue/useAlerts'
import { useClient } from '../useClient'

function DEFAULT_THREAD_OBJECT(id: UUID = '00000000-0000-0000-0000-000000000000'): ThreadObject {
  return {
    id,
    events: [],
    schema: { title: id, inputs: [], outputs: [], nodes: [] },
  }
}

export const useThreads = createCachedComposable((parameters: UseThread.UseSearchOptions) => {
  const { workspace, project, flow } = parameters
  const client = useClient<ModuleThread>()
  // const alerts = useAlerts()

  const options = ref({}) as Ref<UseThread.SearchOptions>
  const threads = ref([]) as Ref<ThreadObject[]>
  const selectedThreadId = ref<UUID>()
  const isSelectedThreadNew = ref(false)
  const threadSessionsControllers = new Map<UUID, AbortController>()

  // --- An array of thread that are being subscribed.
  const lock = createResolvable<void>()
  // const subscribers = ref(0)
  // const abortController = new AbortController()
  lock.resolve()

  function getDateGroup(dateString?: string): UseThread.GroupType {
    if (!dateString) return 'older'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    if (diffHours <= 1) return 'lastHour'
    if (diffHours <= 24) return 'today'
    if (diffDays <= 7) return 'thisWeek'
    return 'older'
  }

  return toReactive({
    data: threads,
    options,
    selectedThreadId,
    isSelectedThreadNew,

    threadById: (id: MaybeRef<undefined | UUID>) => computed<ThreadObject>(() => {
      if (!unref(id)) return DEFAULT_THREAD_OBJECT()
      const thread = threads.value.find(t => t.id === unref(id))
      return thread ?? DEFAULT_THREAD_OBJECT(unref(id))
    }),

    threadsByDate: computed(() => {
      const groups: UseThread.Group[] = [
        { icon: 'i-carbon:alarm', type: 'lastHour', threads: [] },
        { icon: 'i-carbon:calendar', type: 'today', threads: [] },
        { icon: 'i-carbon:calendar-heat-map', type: 'thisWeek', threads: [] },
        { icon: 'i-carbon:archive', type: 'older', threads: [] },
      ]
      for (const thread of threads.value) {
        const groupType = getDateGroup(thread.createdAt)
        const group = groups.find(g => g.type === groupType)
        if (group) group.threads.push(thread)
      }

      // --- Sort the threads in each group by createdAt date.
      for (const group of groups) {
        group.threads.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0
          return b.createdAt.localeCompare(a.createdAt)
        })
      }

      return groups
        .filter(group => group.threads.length > 0)
    }),

    search: async() => {
      if (lock.isPending) return lock.promise
      lock.reset()
      await client.request(
        'GET /workspaces/:workspace/projects/:project/flows/:flow/threads',
        {
          parameters: { workspace, project, flow },
          query: { ...options.value },
          onData: data => threads.value = data,
          onEnd: () => lock.resolve(),
        },
      )
    },

    start: (thread: UseThread.CreateOptions) =>
      client.requestAttempt(
        'POST /workspaces/:workspace/projects/:project/flows/:flow/threads',
        {
          parameters: { workspace, project, flow },
          body: thread,
          onData: (data) => {
            threads.value.push(data)
            threads.value = [...threads.value]
            selectedThreadId.value = data.id
            isSelectedThreadNew.value = true
          },
        },
      ),

    selectThread: (id?: UUID) => {
      if (!id) return
      if (selectedThreadId.value === id) return
      selectedThreadId.value = id
      isSelectedThreadNew.value = false
    },

    fetchThread: async(id: UUID) => {
      await client.requestAttempt(
        'GET /workspaces/:workspace/projects/:project/flows/:flow/threads/:thread',
        {
          parameters: { workspace, project, flow, thread: id },
          query: { withSchema: true },
          onData: (data) => {
            const index = threads.value.findIndex(t => t.id === id)
            if (index === -1) threads.value.push(data)
            else threads.value[index] = { ...threads.value[index], ...data }
            threads.value = [...threads.value]
          },
        },
      )
    },

    subscribeToThread: async(id: UUID) => {
      if (threadSessionsControllers.has(id)) return
      if (threads.value.some(t => t.id === id && t.events && t.events.length > 0)) {
        // If the thread already has events, we don't need to subscribe.
        return
      }

      const controller = new AbortController()
      threadSessionsControllers.set(id, controller)

      const thread = threads.value.find(t => t.id === id)
      if (thread) thread.events = []
      else threads.value.push(DEFAULT_THREAD_OBJECT(id))

      await client.request(
        'GET /workspaces/:workspace/projects/:project/flows/:flow/threads/:thread/events',
        {
          parameters: { workspace, project, flow, thread: id },
          signal: controller.signal,
          onData: ({ data }) => {
            for (const event of data) {
              const thread = threads.value.find(t => t.id === id)
              if (!thread) continue
              thread.events ??= []
              thread.events.push(event)
              thread.events = [...thread.events]
            }
          },
          onEnd: () => {
            threadSessionsControllers.delete(id)
          },
        },
      )
    },

    unsubscribeFromThread: (id: UUID) => {
      const controller = threadSessionsControllers.get(id)
      if (!controller) return
      controller.abort()
      threadSessionsControllers.delete(id)
      const thread = threads.value.find(t => t.id === id)
      if (thread) thread.events = []
    },
  })
}, {
  cacheKey: ({ workspace, project, flow }) => [workspace, project, flow].join('/'),
  isPersistent: true,
})
