import type { application, ProjectObject } from '@nwrx/nano-api'
import type { RouteRequestQuery } from '@unserved/client'
import type { WorkspaceObject } from '../../api/workspace'
import { useAlerts, useClient } from '#imports'

type UseWorkspaceOptions = RouteRequestQuery<typeof application, 'GET /api/workspaces/:workspace/projects'>

/**
 * Fetch the project data from the API and provide methods to interact with it.
 *
 * @param name The name of the workspace that the project belongs to.
 * @param options The options to pass to the request.
 * @returns The project data and methods to interact with it.
 */
export function useWorkspace(name: MaybeRef<string>, options: UseWorkspaceOptions = {}) {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref<WorkspaceObject>({ name: '', isPublic: false })
  const projects = ref<ProjectObject[]>([])

  const getWorkspace = async() => {
    await client.request('GET /api/workspaces/:workspace', {
      onData: workspace => data.value = workspace,
      data: { workspace: unref(name), ...options },
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
    getWorkspace,

    /***************************************************************************/
    /* Projects                                                                */
    /***************************************************************************/

    searchProjects,
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
