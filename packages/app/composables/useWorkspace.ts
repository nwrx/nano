import type { application, ProjectObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'
import type { WorkspaceObject } from '../../api/workspace'
import { useAlerts, useClient } from '#imports'

type UseProjectOptions = Omit<RouteRequestData<typeof application, 'GET /api/workspaces/:workspace/projects'>, 'workspace'>
export type CreateProjectOptions = Omit<RouteRequestData<typeof application, 'POST /api/workspaces/:workspace/projects'>, 'workspace'>

/**
 * Fetch the project data from the API and provide methods to interact with it.
 *
 * @param workspace The name of the workspace that the project belongs to.
 * @param options The options to pass to the request.
 * @returns The project data and methods to interact with it.
 */
export function useWorkspace(workspace: MaybeRef<string>, options: UseProjectOptions = {}) {
  const client = useClient()
  const alerts = useAlerts()
  const data = ref<WorkspaceObject>({ name: '', isPublic: false })
  const projects = ref<ProjectObject[]>([])

  const getWorkspace = async() => {
    await client.request('GET /api/workspaces/:workspace', {
      onData: workspace => data.value = workspace,
      data: { workspace: unref(workspace), ...options },
    })
  }

  const searchProjects = async(query?: string) => {
    await client.request('GET /api/workspaces/:workspace/projects', {
      data: { workspace: unref(workspace), query },
      onData: data => projects.value = data,
    })
  }

  return {
    data,
    projects,
    getWorkspace,
    searchProjects,

    createProject: async(title: string) => {
      await client.requestAttempt('POST /api/workspaces/:workspace/projects', {
        data: { workspace: unref(workspace), title },
        onSuccess: () => alerts.success('Project created successfully'),
        onEnd: () => void searchProjects(),
      })
    },

    // deleteProject: async(project: string) =>
    //   await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project', {
    //     onError: error => alerts.error(error),
    //     onSuccess: () => alerts.success('Project deleted successfully'),
    //     onEnd: () => { void refresh() },
    //     data: { workspace: unref(workspace), project },
    //   }),
  }
}
