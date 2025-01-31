import type { WorkspaceObject } from '@nwrx/api'
import type { InferInput } from '@unserved/client'
import type { application } from '~/server'
import { useAlerts, useClient } from '#imports'

type UseProjectOptions = Omit<InferInput<typeof application, 'GET /api/workspaces/:workspace'>, 'workspace'>
export type CreateProjectOptions = Omit<InferInput<typeof application, 'POST /api/workspaces/:workspace'>, 'workspace'>

/**
 * Fetch the project data from the API and provide methods to interact with it.
 *
 * @param workspace The name of the workspace that the project belongs to.
 * @param options The options to pass to the request.
 * @returns The project data and methods to interact with it.
 */
export function useWorkspace(workspace: MaybeRef<string>, options: UseProjectOptions = {}) {
  const data = ref<WorkspaceObject>({} as WorkspaceObject)
  const refresh = async() => {
    await useClient().requestAttempt('GET /api/workspaces/:workspace', {
      onError: error => showError(error),
      onData: project => data.value = project,
      data: {
        workspace: unref(workspace),
        ...options,
      },
    })
  }

  return {
    data: toReactive(data) as WorkspaceObject,
    refresh,

    /**
     * Create a new project within the workspace.
     *
     * @param options The options to create the project with.
     * @returns The created project object.
     */
    createProject: async(options: CreateProjectOptions) =>
      await useClient().requestAttempt('POST /api/workspaces/:workspace', {
        onError: error => useAlerts().error(error),
        onSuccess: () => useAlerts().success('Project created successfully'),
        onEnd: () => { void refresh() },
        data: { workspace: unref(workspace), ...options },
      }),

    /**
     * Create a new flow within the given project.
     *
     * @param project The name of the project to create the flow in.
     * @returns The created flow object.
     */
    createFlow: async(project: string) =>
      await useClient().requestAttempt('POST /api/workspaces/:workspace/:project', {
        onError: error => useAlerts().error(error),
        onSuccess: () => useAlerts().success('Flow created successfully'),
        onEnd: () => { void refresh() },
        data: { workspace: unref(workspace), project },
      }),

    /**
     * Delete the given flow from the given project.
     *
     * @param project The name of the project to delete the flow from.
     * @param flow The name of the flow to delete.
     * @returns A promise that resolves when the flow is deleted.
     */
    deleteFlow: async(project: string, flow: string) =>
      await useClient().requestAttempt('DELETE /api/workspaces/:workspace/:project/:flow', {
        onError: error => useAlerts().error(error),
        onSuccess: () => useAlerts().success('Flow deleted successfully'),
        onEnd: () => { void refresh() },
        data: { workspace: unref(workspace), project, flow },
      }),

    /**
     * Delete a project from the workspace.
     *
     * @param project The name of the project to delete.
     * @returns A promise that resolves when the project is deleted.
     */
    // deleteProject: async(project: string) =>
    //   await useClient().requestAttempt('DELETE /api/workspaces/:workspace/:project', {
    //     onError: error => useAlerts().error(error),
    //     onSuccess: () => useAlerts().success('Project deleted successfully'),
    //     onEnd: () => { void refresh() },
    //     data: { workspace: unref(workspace), project },
    //   }),
  }
}
