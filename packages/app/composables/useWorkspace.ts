import type { application, ProjectObject, WorkspaceObject, WorkspaceUserPermissions } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'
import { useAlerts, useClient } from '#imports'

type UseWorkspaceOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/projects'>

export function useWorkspace(name: MaybeRef<string>, options: UseWorkspaceOptions = {}) {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref<WorkspaceObject>({ name: '', isPublic: false })
  const projects = ref<ProjectObject[]>([])
  const assignments = ref<WorkspaceUserPermissions[]>([])

  const getWorkspace = async() => {
    await client.request('GET /api/workspaces/:workspace', {
      onData: workspace => data.value = workspace,
      data: { workspace: unref(name), ...options },
    })
  }

  const getAssignments = async() => {
    await client.request('GET /api/workspaces/:workspace/assignments', {
      onData: data => assignments.value = data,
      data: { workspace: unref(name) },
    })
  }

  const searchProjects = async(query?: string) => {
    await client.request('GET /api/workspaces/:workspace/projects', {
      data: { workspace: unref(name), query },
      onData: data => projects.value = data,
    })
  }

  return {
    data,
    projects,
    assignments,
    getWorkspace,
    getAssignments,
    searchProjects,

    rename: async(newName: string) => {
      await client.requestAttempt('PUT /api/workspaces/:workspace/name', {
        data: { workspace: unref(name), name: newName },
        onSuccess: async() => {
          await getWorkspace()
          alerts.success(localize({
            en: `The workspace has been renamed to "${newName}"`,
            fr: `L'espace de travail a été renommé en "${newName}"`,
            de: `Der Arbeitsbereich wurde in "${newName}" umbenannt`,
            es: `El espacio de trabajo se ha renombrado a "${newName}"`,
            zh: `工作区已重命名为 "${newName}"`,
          }))
        },
      })
    },

    /***************************************************************************/
    /* Projects                                                                */
    /***************************************************************************/

    createProject: async(title: string) => {
      await client.requestAttempt('POST /api/workspaces/:workspace/projects', {
        data: { workspace: unref(name), title },
        onSuccess: async() => {
          await searchProjects()
          alerts.success(localize({
            en: `The "${title}" project has been created successfully`,
            fr: `Le projet "${title}" a été créé avec succès`,
            de: `Das Projekt "${title}" wurde erfolgreich erstellt`,
            es: `El proyecto "${title}" se ha creado correctamente`,
            zh: `"${title}" 项目已成功创建`,
          }))
        },
      })
    },

    deleteProject: async(name: string) => {
      await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project', {
        onEnd: () => void searchProjects(),
        onSuccess: async() => {
          await searchProjects()
          alerts.success(localize({
            en: `The "${name}" project has been deleted successfully`,
            fr: `Le projet "${name}" a été supprimé avec succès`,
            de: `Das Projekt "${name}" wurde erfolgreich gelöscht`,
            es: `El proyecto "${name}" se ha eliminado correctamente`,
            zh: `"${name}" 项目已成功删除`,
          }))
        },
      })
    },
  }
}
