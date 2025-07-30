import type { ProjectObject, ProjectUserPermissions } from '@nwrx/nano-api'
import type { UseProject } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { toSlug } from '@unshared/string/toSlug'

export const useProject = createCachedComposable(
  (parameters: UseProject.UseOptions) => {
    const { workspace, project } = parameters

    const client = useClient()
    const alerts = useAlerts()
    const data = ref<ProjectObject>({} as ProjectObject)
    const assignments = ref<ProjectUserPermissions[]>([])
    const lock = createResolvable<void>()
    lock.resolve()

    return toReactive({
      data,
      assignments,

      fetchProject: async() => {
        if (lock.isPending) return lock.promise
        lock.reset()
        await client.requestAttempt('GET /api/workspaces/:workspace/projects/:project', {
          parameters: { workspace, project },
          onData: project => data.value = project,
          onEnd: () => lock.resolve(),
        })
      },

      fetchAssignments: async() => {
        await client.requestAttempt('GET /api/workspaces/:workspace/projects/:project/assignments', {
          parameters: { workspace, project },
          onData: data => assignments.value = data,
        })
      },

      updateProject: async(options: UseProject.UpdateOptions) => {
        await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project', {
          parameters: { workspace, project },
          body: { ...options },
          onSuccess: () => {
            alerts.success(localize({
              en: `The **${workspace}/${project}** project has been updated successfully`,
              fr: `Le projet **${workspace}/${project}** a été mis à jour avec succès`,
              de: `Das Projekt **${workspace}/${project}** wurde erfolgreich aktualisiert`,
              es: `El proyecto **${workspace}/${project}** ha sido actualizado correctamente`,
              zh: `**${workspace}/${project}** 项目已成功更新`,
            }))
          },
        })
      },

      renameProject: async(name: string) => {
        await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/name', {
          parameters: { workspace, project },
          body: { name },
          onSuccess: () => {
            const newName = toSlug(name)
            alerts.success(localize({
              en: `The **${workspace}/${project}** project has been renamed to **${newName}** successfully`,
              fr: `Le projet **${workspace}/${project}** a été renommé en **${newName}** avec succès`,
              de: `Das Projekt **${workspace}/${project}** wurde erfolgreich in **${newName}** umbenannt`,
              es: `El proyecto **${workspace}/${project}** ha sido renombrado a **${newName}** correctamente`,
              zh: `**${workspace}/${project}** 项目已成功重命名为 **${newName}**`,
            }))
          },
        })
      },

      removeProject: async() => {
        await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project', {
          parameters: { workspace, project },
          onSuccess: () => {
            alerts.success(localize({
              en: `The "${data.value.name}" project has been removed successfully`,
              fr: `Le projet "${data.value.name}" a été supprimé avec succès`,
              de: `Das Projekt "${data.value.name}" wurde erfolgreich entfernt`,
              es: `El proyecto "${data.value.name}" se ha eliminado correctamente`,
              zh: `"${data.value.name}" 项目已成功删除`,
            }))
          },
        })
      },

      subscribeToEvents: () => {
        void client.requestAttempt('GET /api/workspaces/:workspace/projects/:project/events', {
          parameters: { workspace, project },
          onData: ({ data: eventData }) => {
            if (eventData.event === 'project.renamed') {
              data.value.name = eventData.data.name
              const route = useRoute()
              if (route.params.project !== data.value.name) return
              route.params.project = eventData.data.name
              void useRouter().replace(route.fullPath)
            }
            else if (eventData.event === 'project.removed') {
              // Handle project removal
            }
            else if (eventData.event === 'project.updated') {
              data.value = { ...data.value, ...eventData.data }
            }
          },
        })
      },
    })
  },
  {
    cacheKey: ({ workspace, project }) => [workspace, project].join('/'),
  },
)
