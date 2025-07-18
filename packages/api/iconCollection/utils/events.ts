export namespace IconCollectionEventData {
  export interface InstallStart {
    event: 'installStart'
    collection: string
  }
  export interface InstallDone {
    event: 'installDone'
    collection: string
  }

  export interface InstallIconStart {
    event: 'installIconStart'
    collection: string
    icon: string
    totalIcons: number
    currentIcon: number
  }

  export interface InstallIconDone {
    event: 'installIconDone'
    collection: string
    icon: string
    totalIcons: number
    currentIcon: number
  }

  export interface InstallError {
    event: 'installError'
    collection: string
    error: string
  }

  export interface Enabled {
    event: 'enabled'
    collection: string
  }

  export interface Disabled {
    event: 'disabled'
    collection: string
  }

  export interface Uninstalled {
    event: 'uninstalled'
    collection: string
  }
}

export type IconCollectionEvents =
  | IconCollectionEventData.Disabled
  | IconCollectionEventData.Enabled
  | IconCollectionEventData.InstallDone
  | IconCollectionEventData.InstallError
  | IconCollectionEventData.InstallIconDone
  | IconCollectionEventData.InstallIconStart
  | IconCollectionEventData.InstallStart
  | IconCollectionEventData.Uninstalled
