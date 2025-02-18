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

  getFlowRoute(workspace: string, project: string, flow: string) {
    if (!flow || !project || !workspace) return
    return {
      name: 'ProjectFlowEditor',
      params: { workspace, project, flow },
    }
  },

  getChatRoute(workspace: string, project: string, flow: string) {
    return {
      name: 'WorkspaceChat',
      params: { workspace, project, flow, thread: 'new' },
    }
  },
}))
