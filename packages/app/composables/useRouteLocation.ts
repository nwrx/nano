export const useRouteLocation = createSharedComposable(() => ({
  getWorkspaceRoute(workspace: string) {
    return {
      name: 'Workspace',
      params: { workspace },
    }
  },

  getWorkspaceChatRoute(workspace: string) {
    return {
      name: 'WorkspaceChat',
      params: { workspace },
    }
  },

  getWorkspaceMonitoringRoute(workspace: string) {
    return {
      name: 'WorkspaceMonitoring',
      params: { workspace },
    }
  },

  getProjectSettingsRoute(workspace: string, project: string) {
    return {
      name: 'ProjectSettings',
      params: { workspace, project },
    }
  },

  getFlowRoute(workspace: string, project: string, name: string) {
    if (!name || !project || !workspace) return
    return {
      name: 'ProjectFlowEditor',
      params: { workspace, project, name },
    }
  },

  getChatRoute(workspace: string, project: string, flow: string) {
    return {
      name: 'WorkspaceChat',
      params: { workspace, project, flow, thread: 'new' },
    }
  },
}))
