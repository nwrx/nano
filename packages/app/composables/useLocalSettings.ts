export interface LocalSettings {
  drawerOpen?: boolean
  themeColor?: string
  workspaceOpenProjects?: Record<string, boolean>
  monitoringEventNames?: string[]
  monitoringEventTypes?: string[]
  editorPanelTab?: string
  editorPanelOpen?: boolean
  editorPanelWidth?: number
  editorPanelSecretsOpen?: boolean
  editorPanelVariablesOpen?: boolean
  editorPanelNodeInputOpen?: boolean
  editorPanelNodeOutputOpen?: boolean
  editorPanelNodeMetadataOpen?: boolean
  editorNodeTextareaShowPreview?: boolean
}

export const useLocalSettings = createGlobalState(() =>
  useLocalStorage<LocalSettings>('__App_LocalSettings', {
    drawerOpen: true,
    themeColor: 'auto',
    workspaceOpenProjects: {},
    monitoringEventNames: [],
    monitoringEventTypes: [],
    editorPanelTab: 'node',
    editorPanelOpen: true,
    editorPanelWidth: 512,
    editorPanelSecretsOpen: false,
    editorPanelNodeInputOpen: false,
    editorPanelNodeOutputOpen: false,
    editorPanelNodeMetadataOpen: false,
    editorNodeTextareaShowPreview: true,
  }))
