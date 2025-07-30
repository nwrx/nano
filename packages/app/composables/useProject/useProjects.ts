import type { ProjectObject } from '@nwrx/nano-api'
import type { UseProject } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { useAlerts } from '@unshared/vue/useAlerts'
import { useClient } from '../useClient'

export function createProjectsClient(parameters: UseProject.UseSearchOptions) {
  const { workspace } = parameters
  const client = useClient()
  const alerts = useAlerts()
  const options = ref({}) as Ref<UseProject.SearchOptions>
  const data = ref([]) as Ref<ProjectObject[]>
  const lock = createResolvable<void>()
  lock.resolve()

  return toReactive({
    data,
    options,

    searchProjects: async() => {
      if (lock.isPending) return lock.promise
      await client.request('GET /api/workspaces/:workspace/projects', {
        parameters: { workspace },
        query: { ...options.value },
        onData: projects => data.value = projects,
        onEnd: () => lock.resolve(),
      })
    },

    createProject: async(options: UseProject.CreateOptions) => {
      await client.requestAttempt('POST /api/workspaces/:workspace/projects', {
        parameters: { workspace },
        body: { ...options },
        onSuccess: () => {
          alerts.success(localize({
            en: `The "${options.name}" project has been created successfully`,
            fr: `Le projet "${options.name}" a été créé avec succès`,
            de: `Das Projekt "${options.name}" wurde erfolgreich erstellt`,
            es: `El proyecto "${options.name}" se ha creado correctamente`,
            zh: `"${options.name}" 项目已成功创建`,
          }))
        },
      })
    },

    subscribeToEvents: () => {
      void client.request('GET /api/workspaces/:workspace/events', {
        parameters: { workspace },
        onData: ({ data: event }) => {
          if (event.event === 'workspace.project.created') {
            data.value.push(event.data)
          }
          else if (event.event === 'workspace.project.updated') {
            const project = data.value.find(project => project.name === event.data.name)
            if (!project) return
            Object.assign(project, event.data)
            data.value = [...data.value] // Trigger reactivity
          }
          else if (event.event === 'workspace.project.renamed') {
            const project = data.value.find(project => project.name === event.data.oldName)
            if (!project) return
            project.name = event.data.name
            data.value = [...data.value] // Trigger reactivity
          }
          else if (event.event === 'workspace.project.removed') {
            data.value = data.value.filter(project => project.name !== event.data.name)
          }
        },
      })
    },
  })
}

export const useProjects = createCachedComposable(createProjectsClient, {
  cacheKey: ({ workspace }) => workspace,
})
