import type { application, WorkspaceProjectObject } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'
import { useAlerts, useClient } from '#imports'

type UseProjectOptions = Omit<RouteRequestData<typeof application, 'GET /api/projects'>, 'workspace'>
export type CreateProjectOptions = Omit<RouteRequestData<typeof application, 'POST /api/workspaces/:workspace'>, 'workspace'>

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
  const data = ref<WorkspaceProjectObject[]>([])

  const refresh = async() => {
    await client.request('GET /api/projects', {
      onData: project => data.value = project,
      data: { workspace: unref(workspace), ...options },
    })
  }

  return {
    data,
    refresh,

    /**
     * Create a new project within the workspace.
     *
     * @param options The options to create the project with.
     * @returns The created project object.
     */
    createProject: async(options: CreateProjectOptions) =>
      await client.requestAttempt('POST /api/workspaces/:workspace', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success('Project created successfully'),
        onEnd: () => void refresh(),
        data: { workspace: unref(workspace), ...options },
      }),

    /**
     * Create a new flow within the given project.
     *
     * @param project The name of the project to create the flow in.
     * @returns The created flow object.
     */
    createFlow: async(project: string) =>
      await client.requestAttempt('POST /api/flows', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success('Flow created successfully'),
        onEnd: () => void refresh(),
        data: { workspace: unref(workspace), project },
      }),

    /**
     * Import a flow from the given `File` object into the given project.
     * The file should either be a JSON or YAML file containing the flow data.
     *
     * @param project The name of the project to import the flow into.
     * @param file The file to import the flow from.
     */
    importFlow: async(project: string, file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      await client.requestAttempt('POST /api/workspaces/:workspace/:project/import', {
        onError: error => alerts.error(error),
        onSuccess: () => alerts.success('Flow imported successfully'),
        onEnd: () => void refresh(),
        data: { workspace: unref(workspace), project, file },
      })
    },

    /**
     * Delete the given flow from the given project.
     *
     * @param project The name of the project to delete the flow from.
     * @param flow The name of the flow to delete.
     * @returns A promise that resolves when the flow is deleted.
     */
    // deleteFlow: async(project: string, flow: string) =>
    //   await client.requestAttempt('DELETE /api/workspaces/:workspace/:project/:flow', {
    //     onError: error => alerts.error(error),
    //     onSuccess: () => alerts.success('Flow deleted successfully'),
    //     onEnd: () => void refresh(),
    //     data: { workspace: unref(workspace), project, flow },
    //   }),

    /**
     * Delete a project from the workspace.
     *
     * @param project The name of the project to delete.
     * @returns A promise that resolves when the project is deleted.
     */
    // deleteProject: async(project: string) =>
    //   await client.requestAttempt('DELETE /api/workspaces/:workspace/:project', {
    //     onError: error => alerts.error(error),
    //     onSuccess: () => alerts.success('Project deleted successfully'),
    //     onEnd: () => { void refresh() },
    //     data: { workspace: unref(workspace), project },
    //   }),
  }
}
