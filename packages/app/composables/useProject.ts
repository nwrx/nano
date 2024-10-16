import type { WorkspaceProjectObject, WorkspaceProjectPermission } from '@nwrx/api'
import type { InferInput } from '@unserved/client'
import type { application } from '~/server'
import { useAlerts, useClient, useRouter } from '#imports'

/** The options to pass to the {@linkcode useProject} composable. */
export type UseProjectOptions = Omit<InferInput<typeof application, 'GET /api/workspaces/:workspace/:project'>, 'project' | 'workspace'>
export type ProjectSetSettingsOptions = Omit<InferInput<typeof application, 'PUT /api/workspaces/:workspace/:project'>, 'project' | 'workspace'>
export type ProjectSetNameOptions = Omit<InferInput<typeof application, 'PUT /api/workspaces/:workspace/:project/name'>, 'project' | 'workspace'>

/**
 * Fetch the project data from the API and provide methods to interact with it.
 *
 * @param workspace The name of the workspace that the project belongs to.
 * @param project The name of the project to fetch.
 * @param options The options to pass to the request.
 * @returns The project data and methods to interact with it.
 */
export function useProject(workspace: MaybeRef<string>, project: MaybeRef<string>, options: UseProjectOptions = {}) {
  const alerts = useAlerts()
  const router = useRouter()
  const client = useClient()
  const data = ref<WorkspaceProjectObject>({} as WorkspaceProjectObject)

  const refresh = async() => {
    await client.requestAttempt('GET /api/workspaces/:workspace/:project', {
      onError: error => showError(error),
      onData: project => data.value = project,
      data: {
        workspace: unref(workspace),
        project: unref(project),
        ...options,
      },
    })
  }

  return {
    data: toReactive(data) as WorkspaceProjectObject,
    refresh,

    /**
     * Update the project settings such as the name and description.
     *
     * @param data The project settings to update.
     * @returns A promise that resolves when the project is updated.
     */
    setSettings: async(data: ProjectSetSettingsOptions) =>
      await client.requestAttempt('PUT /api/workspaces/:workspace/:project', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('Project updated successfully')
          void refresh()
        },
        data: {
          workspace: unref(workspace),
          project: unref(project),
          ...data,
        },
      }),

    /**
     * Rename the project to a new name.
     *
     * @param name The new name to assign to the project.
     * @returns A promise that resolves when the project is renamed.
     */
    setName: async(name: string) => {
      await client.requestAttempt('PUT /api/workspaces/:workspace/:project/name', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('Project name updated successfully')
          if (router.currentRoute.value.name === 'ProjectSettings')
            void router.replace({ name: 'ProjectSettings', params: { workspace: unref(workspace), project: name } })
        },
        data: {
          workspace: unref(workspace),
          project: unref(project),
          name,
        },
      })
    },

    /**
     * Update the permissions of a user assigned to the project.
     *
     * @param username The username of the user to update.
     * @param permissions The permissions to assign to the user.
     * @returns The updated project object.
     */
    setUserAssignments: async(username: string, permissions: WorkspaceProjectPermission[]) =>
      await client.requestAttempt('PUT /api/workspaces/:workspace/:project/assignments/:username', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('User assigned successfully')
          void refresh()
        },
        data: {
          project: unref(project),
          workspace: unref(workspace),
          username,
          permissions,
        },
      }),

    /**
     * Delete the project from the database and go back to the projects page.
     *
     * @returns A promise that resolves when the project is deleted.
     */
    delete: async() =>
      await client.requestAttempt('DELETE /api/workspaces/:workspace/:project', {
        onError: error => alerts.error(error),
        onSuccess: () => {
          alerts.success('Project deleted successfully')
          if (router.currentRoute.value.name === 'ProjectSettings')
            void router.replace({ name: 'Workspace', params: { name: unref(workspace) } })
        },
        data: {
          workspace: unref(workspace),
          project: unref(project),
        },
      }),
  }
}
