import type { application, ProjectObject, ProjectPermission } from '@nwrx/nano-api'
import type { RouteRequestData } from '@unserved/client'
import { useAlerts, useClient, useRouter } from '#imports'

/** The options to pass to the {@linkcode useProject} composable. */
export type UseProjectOptions = Omit<RouteRequestData<typeof application, 'GET /api/workspaces/:workspace/projects/:project'>, 'project' | 'workspace'>
export type SetSettingsOptions = Omit<RouteRequestData<typeof application, 'PUT /api/workspaces/:workspace/projects/:project'>, 'project' | 'workspace'>

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
  const data = ref<ProjectObject>({} as ProjectObject)

  const refresh = async() => {
    await client.requestAttempt('GET /api/workspaces/:workspace/projects/:project', {
      data: {
        workspace: unref(workspace),
        project: unref(project),
        ...options,
      },
      onData: (project) => {
        data.value = project
      },
    })
  }

  return {
    data: toReactive(data) as ProjectObject,
    refresh,

    /**
     * Rename the project to the given name. This will update the project name in the
     * database and redirect to the new project URL if the project was renamed successfully.
     *
     * @param name The new name of the project.
     * @returns A promise that resolves when the project is renamed.
     */
    setName: async(name: string) =>
      await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/name', {
        data: {
          workspace: unref(workspace),
          project: unref(project),
          name,
        },
        onSuccess: async() => {
          await router.replace({ name: 'ProjectSettings', params: { workspace: unref(workspace), project: name } })
          alerts.success('Project renamed successfully')
        },
      }),

    /**
     * Update the project settings such as the name and description.
     *
     * @param data The project settings to update.
     * @returns A promise that resolves when the project is updated.
     */
    setSettings: async(data: SetSettingsOptions) =>
      await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project', {
        data: {
          workspace: unref(workspace),
          project: unref(project),
          ...data,
        },
        onSuccess: () => {
          alerts.success('Project updated successfully')
          void refresh()
        },
      }),

    /**
     * Update the permissions of a user assigned to the project.
     *
     * @param username The username of the user to update.
     * @param permissions The permissions to assign to the user.
     * @returns The updated project object.
     */
    setUserAssignments: async(username: string, permissions: ProjectPermission[]) =>
      await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/assignments/:username', {
        data: {
          project: unref(project),
          workspace: unref(workspace),
          username,
          permissions,
        },
        onSuccess: () => {
          alerts.success('User assigned successfully')
          void refresh()
        },
      }),

    /**
     * Remove the project from the database and go back to the projects page.
     *
     * @returns A promise that resolves when the project is deleted.
     */
    remove: async() =>
      await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project', {
        onSuccess: async() => {
          alerts.success('Project deleted successfully')
          if (router.currentRoute.value.name === 'ProjectSettings')
            await router.replace({ name: 'Workspace', params: { name: unref(workspace) } })
        },
        data: {
          workspace: unref(workspace),
          project: unref(project),
        },
      }),
  }
}
