export const useRouteLocation = createSharedComposable(() => ({

  // Workspace
  getWorkspaceRoute: (workspace: string) => ({ name: 'Workspace', params: { workspace } }),
  getWorkspaceSettingsRoute: (workspace: string) => ({ name: 'WorkspaceSettings', params: { workspace } }),
  getWorkspaceChatRoute: (workspace: string) => ({ name: 'WorkspaceChat', params: { workspace } }),
  getWorkspaceMonitoringRoute: (workspace: string) => ({ name: 'WorkspaceMonitoring', params: { workspace } }),

  // Project
  getProjectSettingsRoute: (workspace: string, project: string) => ({ name: 'ProjectSettings', params: { workspace, project } }),

  // Flow
  getFlowRoute: (workspace: string, project: string, name: string) => ({ name: 'ProjectFlowEditor', params: { workspace, project, name } }),

  // Chat
  getChatRoute: (workspace: string, project: string, flow: string) => ({ name: 'WorkspaceChat', params: { workspace, project, flow, thread: 'new' } }),
}))
