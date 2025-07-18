export interface LocalSettings {
  drawerOpen?: boolean
  themeColor?: string
  workspaceOpenProjects?: Record<string, boolean>
  monitoringEventNames?: string[]
  monitoringEventTypes?: string[]

  // Editor states
  editorConsoleTab?: string
  editorConsoleShow?: boolean
  editorPanelTab?: string
  editorPanelOpen?: boolean
  editorPanelWidth?: number
  editorPanelSecretsOpen?: boolean
  editorPanelVariablesOpen?: boolean
  editorPanelFlowSettingsOpen?: boolean
  editorPanelNodeInputOpen?: boolean
  editorPanelNodeOutputOpen?: boolean
  editorPanelNodeMetadataOpen?: boolean
  editorNodeTextareaShowPreview?: boolean

  // Chat states
  chatPanelOpen?: boolean

  // Integration states
  integrationPanelOpen?: boolean
  integrationPanelOpenedGroups?: string[]
}

export const useLocalSettings = createGlobalState(() =>
  useLocalStorage<LocalSettings>('__App_LocalSettings', {
    drawerOpen: true,
    themeColor: 'auto',
    workspaceOpenProjects: {},
    monitoringEventNames: [],
    monitoringEventTypes: [],
    editorPanelTab: 'node',
    editorConsoleTab: 'view',
    editorPanelWidth: 512,

    integrationPanelOpen: true,
    integrationPanelOpenedGroups: [],
  }))
