import type { application, FlowObject, ProjectObject, ProjectPermission } from '@nwrx/nano-api'
import type { ChannelConnectOptions, RouteRequestData } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
import { useAlerts, useClient, useRouter } from '#imports'

/** The options to pass to the {@linkcode useProject} composable. */
export type UseProjectChannel = WebSocketChannel<ChannelConnectOptions<typeof application, 'WS /ws/workspaces/:workspace/projects/:project'>>
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
  const flows = ref<FlowObject[]>([])

  let channel: undefined | UseProjectChannel
  tryOnScopeDispose(() => {
    if (!channel) return
    void channel.close()
  })

  const getProject = async() => {
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
    data,
    flows,
    getProject,

    setName: async(name: string) => {
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
      })
    },

    setSettings: async(data: SetSettingsOptions) => {
      await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project', {
        data: {
          workspace: unref(workspace),
          project: unref(project),
          ...data,
        },
        onSuccess: () => {
          alerts.success('Project updated successfully')
          void getProject()
        },
      })
    },

    setUserAssignments: async(username: string, permissions: ProjectPermission[]) => {
      await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/assignments/:username', {
        data: {
          project: unref(project),
          workspace: unref(workspace),
          username,
          permissions,
        },
        onSuccess: () => {
          alerts.success('User assigned successfully')
          void getProject()
        },
      })
    },

    remove: async() => {
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
      })
    },

    /***************************************************************************/
    /* Flows                                                                   */
    /***************************************************************************/

    createFlow: async() => {
      await client.requestAttempt('POST /api/workspaces/:workspace/projects/:project/flows', {
        data: {
          workspace: unref(workspace),
          project: unref(project),
        },
        onSuccess: () => {
          alerts.success('Flow created successfully')
        },
      })
    },

    removeFlow: async(flow: string) => {
      await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project/flows/:flow', {
        data: {
          workspace: unref(workspace),
          project: unref(project),
          flow,
        },
        onSuccess: () => {
          alerts.success('Flow deleted successfully')
        },
      })
    },

    // importFlow: async(project: string, file: File) => {
    //   const formData = new FormData()
    //   formData.append('file', file)
    //   await client.requestAttempt('POST /api/workspaces/:workspace/projects/:project/import', {
    //     onSuccess: () => alerts.success('Flow imported successfully'),
    //     onEnd: () => void refresh(),
    //     data: { workspace: unref(workspace), project, file },
    //   })
    // },

    /***************************************************************************/
    /* Subscriptions                                                           */
    /***************************************************************************/

    subscribe: async() => {
      if (channel) return
      channel = await client.connect('WS /ws/workspaces/:workspace/projects/:project', {
        data: {
          workspace: unref(workspace),
          project: unref(project),
        },
        onMessage: (message) => {
          if (message.event === 'flows') flows.value = message.flows
          if (message.event === 'flowCreated') flows.value = [...flows.value, message.flow]
          if (message.event === 'flowDeleted') flows.value = flows.value.filter(flow => flow.name !== message.name)
        },
      })
    },

    unsubscribe: async() => {
      if (!channel) return
      await channel.close()
      channel = undefined
    },
  }
}
