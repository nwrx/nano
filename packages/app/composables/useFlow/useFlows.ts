import type { FlowObject } from '@nwrx/nano-api'
import type { UseFlow } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { useAlerts } from '@unshared/vue/useAlerts'
import { useClient } from '../useClient'

export const useFlows = createCachedComposable(
  (parameters: UseFlow.UseSearchOptions) => {
    const { workspace, project } = parameters
    const client = useClient()
    const alerts = useAlerts()
    const options = ref({}) as Ref<UseFlow.SearchOptions>
    const data = ref([]) as Ref<FlowObject[]>
    const lock = createResolvable<void>()
    const subscribers = ref(0)
    let abortController = new AbortController()
    lock.resolve()

    return toReactive({
      data,
      subscribers,

      searchFlows: async() => {
        if (lock.isPending) return lock.promise
        lock.reset()
        await client.request(
          'GET /api/workspaces/:workspace/projects/:project/flows',
          {
            parameters: { workspace, project },
            query: { ...options.value },
            onData: flows => data.value = flows,
            onEnd: () => lock.resolve(),
          },
        )
      },

      createFlow: async() => {
        await client.requestAttempt(
          'POST /api/workspaces/:workspace/projects/:project/flows',
          {
            parameters: { workspace, project },
            onData: (flow) => {
              alerts.success(localize({
                en: `The **${project}/${flow.name}** flow has been created successfully`,
                fr: `Le flux **${project}/${flow.name}** a été créé avec succès`,
                de: `Der Flow **${project}/${flow.name}** wurde erfolgreich erstellt`,
                es: `El flujo **${project}/${flow.name}** se ha creado correctamente`,
                zh: `**${project}/${flow.name}** 流程已成功创建`,
              }))
            },
          },
        )
      },

      importFlow: async(file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        await client.requestAttempt(
          'POST /api/workspaces/:workspace/projects/:project/import',
          {
            parameters: { workspace, project },
            body: formData,
            onSuccess: () => {
              alerts.success(localize({
                en: 'The flow has been imported successfully',
                fr: 'Le flux a été importé avec succès',
                de: 'Der Flow wurde erfolgreich importiert',
                es: 'El flujo se ha importado correctamente',
                zh: '流程已成功导入',
              }))
            },
          },
        )
      },

      subscribeToEvents: () => {
        subscribers.value++
        if (subscribers.value > 1) return
        void client.requestAttempt(
          'GET /api/workspaces/:workspace/projects/:project/events',
          {
            signal: abortController.signal,
            parameters: { workspace, project },
            onData: ({ data: event }) => {
              if (event.event === 'project.flow.created') {
                data.value.push(event.data)
              }
              else if (event.event === 'project.flow.updated') {
                const flow = data.value.find(flow => flow.name === event.data.name)
                if (!flow) return
                Object.assign(flow, event.data)
                data.value = [...data.value] // Trigger reactivity
              }
              else if (event.event === 'project.flow.renamed') {
                const flow = data.value.find(flow => flow.name === event.data.oldName)
                if (!flow) return
                flow.name = event.data.name
                data.value = [...data.value] // Trigger reactivity
              }
              else if (event.event === 'project.flow.removed') {
                data.value = data.value.filter(flow => flow.name !== event.data.name)
              }
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
    })
  },
  {
    cacheKey: ({ workspace, project }) => [workspace, project].join('/'),
    isPersistent: true,
  },
)
